# Nuxt Paywall

Мобильный paywall для условной детской игры: экран открывается во встроенном webview, пользователь выбирает тариф и оформляет тестовую покупку. Покупка проходит через server route и записывается в Postgres.

- Макет: [Figma](https://www.figma.com/design/esB0mE5BV5EXoOnKiu4hy0/Nuxt-Paywall?node-id=8-111) — фреймы Default / Loading / Error / Success, токены в Variables
- Прод: [nuxt-paywall-auswuchs.netlify.app](https://nuxt-paywall-auswuchs.netlify.app)
- Репозиторий: [github.com/auswuchs/nuxt-paywall](https://github.com/auswuchs/nuxt-paywall)

## Запуск локально

```bash
pnpm install
cp .env.example .env        # вписать NUXT_DATABASE_URL (Postgres, например Neon)
pnpm db:migrate             # создать таблицу purchases
pnpm dev                    # http://localhost:3000
```

Проверки: `pnpm lint`, `pnpm lint:styles`, `pnpm typecheck`.

## Как посмотреть все состояния

- **Ошибка загрузки тарифов** — `/?simulate=error` (сервер отвечает 503). Ошибку покупки можно увидеть, включив Offline в DevTools перед нажатием на кнопку.
- **Покупка привязана к устройству.** `deviceId` берётся из `?deviceId=…` (в реальности его передаёт игра), иначе генерируется и хранится в localStorage. После покупки страница при каждом открытии сразу показывает экран успеха: доступ проверяется на сервере. Чтобы пройти сценарий заново, откройте `/?deviceId=любая-новая-строка` (от 8 символов) или очистите localStorage.
- **«Восстановить покупки»** — ручная проверка доступа на сервере (на случай, если автопроверка при открытии не прошла).
- **Крестик** отправляет событие `close` в нативный мост (`webkit.messageHandlers.paywall` / `window.Android`), в браузере ничего не делает. После покупки в мост уходит событие `purchased`.

## Где что лежит

- Фронтенд — `app/`: страница `pages/index.vue`, компоненты `components/paywall/`, логика экрана `composables/usePaywall.ts`, API-слой `api/PaywallApi.ts`.
- Server routes — `server/api/`: `GET /api/offers`, `POST /api/purchase`, `GET /api/entitlement`.
- БД — `server/db/` (схема Drizzle и миграции) и `server/utils/Purchases.ts` (запросы).

## Деплой и БД

**Netlify**: server routes становятся Netlify Functions, деплой из GitHub, миграции запускаются перед сборкой. **Neon Postgres + Drizzle**: бесплатный serverless Postgres с HTTP-драйвером, который подходит для функций без постоянных соединений, и типизированная схема с миграциями.

## AI-инструменты и что проверено руками

Claude Code — макет в Figma (через MCP), каркас, server routes, вёрстка. Сам ревьюил и правил архитектуру сервера и API-слоя, прошёл все сценарии в браузере (включая Offline и `simulate=error`), проверил записи в Neon и SQL миграций, сверил вёрстку с макетом попиксельно на 390×844 (≈ 98–99%).

## Что упрощено

- Тарифы — константа на сервере, а не таблица в БД.
- `deviceId` — условный идентификатор без авторизации, подделать его может кто угодно. В реальном продукте покупку подтверждает квитанция App Store / Google Play и она привязана к аккаунту.
- Нет автотестов. Состояние Loading с макетом попиксельно не сверялось: оно показывается доли секунды.

## Что сделал бы ещё

- Идемпотентность покупки (ключ запроса) и rate limit на `POST /api/purchase`.
- Разделить нативный мост на универсальный транспорт и события экрана; добавить обратный канал из приложения в webview.
- Карточку тарифа сделать компонентом с вариантами в Figma; анимации смены состояний с учётом `prefers-reduced-motion`.
