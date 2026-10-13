# План: Nuxt Paywall (тестовое задание)

## Что делаем и зачем

Мобильный paywall для условной детской игры: экран открывается во встроенном webview, пользователь выбирает тариф (месяц / год) и «покупает» его. Покупка тестовая, без реальных денег, но она проходит через server route и записывается в БД.

Цель — показать полный цикл: дизайн в Figma → вёрстка 1:1 (pixel perfect 99%) → backend в том же Nuxt-проекте → БД → живой деплой → README.

Ориентир по времени — 2 часа. Всё, что не помещается, не добавляем молча: упрощаем и пишем об этом в README.

## Что сдаём

1. Ссылку на Figma-макет с доступом на просмотр.
2. Ссылку на задеплоенный сервис.
3. Ссылку на GitHub-репозиторий.
4. README до одной страницы: запуск, структура, выбор деплоя и БД, AI-инструменты, «что дальше».

## Дизайн (готов)

Figma: https://www.figma.com/design/esB0mE5BV5EXoOnKiu4hy0/Nuxt-Paywall?node-id=8-111

Фреймы 390×844:
- `Paywall / Default` — основной экран;
- `Paywall / Loading` — скелетоны вместо тарифов, CTA выключена;
- `Paywall / Error` — блок ошибки с кнопкой «Повторить»;
- `Paywall / Success` — все уровни открыты, CTA «Играть».

Токены лежат в Figma Variables (коллекция `Paywall tokens`):
- `color/*`, `radius/*`, `space/*`;
- Text Styles: `Display/28`, `Title/18`, `Body/16` и т.д.

В коде они повторяются один в один как CSS-переменные (`--color-sun`, `--radius-xl`, `--space-16`…).

Направление и принципы описаны в `PRODUCT.md`.

## Стек и почему

| Что | Выбор | Почему |
|---|---|---|
| Фреймворк | Nuxt 4 + TypeScript | Требование ТЗ; frontend и server routes в одном проекте |
| Стили | Свой CSS + CSS-переменные из Figma, без UI-кита | Pixel perfect проще без чужих отступов и стилей |
| Шрифт | Nunito (через `@nuxt/fonts`), Inter только для значков ✓ ✕ | Тот же шрифт, что в макете, совпадение метрик |
| БД | Postgres на Neon | Бесплатно, serverless-драйвер по HTTP хорошо работает в функциях |
| ORM | Drizzle (`drizzle-orm/neon-http`) + `drizzle-kit` | Типизированная схема, миграции, лёгкий рантайм |
| Деплой | Netlify (Nitro preset `netlify`) | Server routes становятся Netlify Functions, деплой из GitHub, бесплатно |

## Архитектура

```
app/
  pages/index.vue            — экран paywall, управляет состояниями
  components/                — LevelsGrid, PlanCard, PrimaryButton, StateError, StateSuccess…
  composables/useDeviceId.ts — UUID в localStorage
  assets/css/tokens.css      — CSS-переменные из Figma Variables
server/
  api/offers.get.ts          — GET  /api/offers
  api/purchase.post.ts       — POST /api/purchase
  api/entitlement.get.ts     — GET  /api/entitlement?deviceId=… («Восстановить покупки»)
  db/Schema.ts               — схема Drizzle
  utils/Database.ts          — getDb(): клиент Drizzle + Neon (ленивый синглтон)
  utils/Purchases.ts         — store: createPurchase, findActiveEntitlement (хендлеры тонкие)
  utils/Errors.ts            — apiError, parseOrFail, readBodyOrFail: единый формат ошибок
  utils/Offers.ts            — тарифы (константа на сервере)
shared/types/                — Offer, Entitlement, ApiErrorData: общие для app и server
drizzle/                     — миграции
```

### API

- `GET /api/offers` → `[{ id: "year", title: "Год", price: 1190, perMonth: 99, discount: 50 }, { id: "month", … }]`.
- `POST /api/purchase` с телом `{ offerId, deviceId }`:
  - валидируем тело (zod или ручная проверка);
  - проверяем, что `offerId` существует;
  - пишем строку в БД, срок считает сама БД (`now() + durationDays`); возвращаем `Entitlement` `{ purchaseId, offerId, purchasedAt, expiresAt }` со статусом 201;
  - на невалидные данные отвечаем 400.
- `GET /api/entitlement?deviceId=…` → активная (не истёкшая) покупка устройства или 404 `entitlement_not_found`.
- Ошибки всегда в одном формате: `{ statusCode, statusMessage, data: { code } }`; `code` типизирован (`ApiErrorCode`).

### БД

Одна таблица `purchases`:

| поле | тип |
|---|---|
| `id` | uuid, pk, default random |
| `offer_id` | text, not null |
| `price` | integer, not null — снимок цены на момент покупки |
| `device_id` | text, not null |
| `created_at` | timestamptz, default now() |
| `expires_at` | timestamptz, not null — `created_at` + срок тарифа |

Индекс `(device_id, expires_at)` — под запрос активной подписки.

Тарифы держим константой на сервере, а не в БД. Их два, и они не меняются; таблица `offers` — кандидат на «следующий шаг».

### Webview

Это не нативное приложение, а веб-страница, которую игра открывает во встроенном webview (WKWebView / Android WebView). Отсюда:

- **Безопасные зоны.** `viewport-fit=cover`, отступы через `env(safe-area-inset-*)`: крестик не должен попасть под чёлку, CTA — под home-индикатор.
- **Высота.** `100dvh` вместо `100vh`.
- **Нативное ощущение:**
  - `touch-action: manipulation` — нет зума по двойному тапу;
  - `overscroll-behavior: none`;
  - `-webkit-tap-highlight-color: transparent`;
  - `-webkit-text-size-adjust: 100%`;
  - ничего не завязано на hover.
- **Мост в приложение.** Крестик и «Играть» отправляют событие (`close`, `purchased`) в нативный мост: `window.webkit.messageHandlers.paywall` или `window.Android`. Если моста нет (обычный браузер), срабатывает фолбэк.
- **deviceId.** Сначала берём из query `?deviceId=…` (его передаёт приложение). Если нет — генерируем UUID и храним в `localStorage`: он в webview может очищаться.
- **Шрифт.** Nunito локально через `@nuxt/fonts`, без запросов к Google в рантайме.
- **Ссылки.** Никаких `target="_blank"` и `window.open`.

### Состояния экрана

`loading` → `ready` ↔ `purchasing` → `success`, плюс `error`. Ошибку загрузки тарифов и ошибку покупки обрабатываем отдельно.

Для проверяющих добавим query-параметр `?simulate=error`, чтобы на проде можно было увидеть состояние ошибки.

## Шаги

- [x] 1. ТЗ, выбор стека, дизайн-бриф (impeccable), `PRODUCT.md`.
- [x] 2. Макет в Figma: Default / Loading / Error / Success, токены в Variables, именованные слои.
- [x] 3. Каркас: `nuxi init` (Nuxt 4), TypeScript strict, ESLint, `@nuxt/fonts`, git-репозиторий.
- [x] 4. БД:
  - создать Neon-проект;
  - описать схему Drizzle, применить миграцию;
  - положить `NUXT_DATABASE_URL` в `.env` и `.env.example`.
- [x] 5. Server routes: offers, purchase, entitlement + валидация, типизированные ошибки, проверка через curl.
- [x] 6. Вёрстка:
  - `tokens.css` из Figma Variables;
  - компоненты;
  - состояния;
  - mobile-first на 360–430px.
- [x] 7. Pixel perfect:
  - скриншот Playwright 390×844;
  - сравнение с экспортом фрейма из Figma (Framelink);
  - правки до совпадения.
- [x] 8. Деплой на Netlify:
  - env `NUXT_DATABASE_URL`;
  - проверить покупку на проде и запись в БД;
  - проверить, открывается ли `*.netlify.app` из РФ.
- [ ] 9. README и финальная проверка, отправка ссылок.

## Риски

- **Pixel perfect.** Расхождения в рендере шрифта между Figma и браузером. Митигация: те же шрифты и явный `line-height` из Figma, сверка скриншотами.
- **Доступность `*.netlify.app` из РФ.** Проверить заранее; запасной вариант — Render или Vercel.
- **Холодный старт Neon.** Первый запрос может занимать ~1 с — это и показывает состояние loading.
- **Время.** Если не укладываемся, режем «Восстановить покупки» до заглушки и пишем об этом в README.

## Что в README пойдёт в «следующий шаг»

- Таблица `offers` в БД и админка цен.
- Идемпотентность покупки (ключ запроса), rate limit.
- e2e-тесты сценария (Playwright), визуальные регрессионные тесты.
- Анимации состояний с учётом `prefers-reduced-motion`.
- Figma-компоненты с вариантами (Plan: selected / default).

## Заметки для README

- **Как пройти сценарий заново.** Покупка привязана к `deviceId` и переживает перезагрузку: после покупки страница сразу открывает экран успеха. Чтобы снова увидеть paywall, откройте `/?deviceId=любая-новая-строка` (от 8 символов) или очистите localStorage. В реальном приложении `deviceId` передаёт игра.
- **Состояние ошибки:** `/?simulate=error`.
- **«Восстановить покупки»** — ручная повторная проверка доступа. При открытии страница проверяет его сама, кнопка нужна, если автопроверка не прошла (сеть), и потому что сторы требуют её на paywall.
- **Крестик** только отправляет событие `close` в нативный мост, в браузере ничего не делает.
