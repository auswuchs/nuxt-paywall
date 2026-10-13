# Nuxt Paywall

Мобильный paywall для условной детской игры: экран открывается во встроенном webview, пользователь выбирает тариф и оформляет тестовую покупку. Покупка проходит через server route и записывается в Postgres.

- Макет: [Figma](https://www.figma.com/design/esB0mE5BV5EXoOnKiu4hy0/Nuxt-Paywall?node-id=8-111) — фреймы Default / Loading / Error / Success, токены в Variables
- Прод: TODO ссылка на Netlify
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

- `app/` — фронтенд: `pages/index.vue` собирает экран, `components/paywall/*` — секции, `composables/usePaywall.ts` — состояние экрана (тарифы, выбор, покупка, восстановление), `api/PaywallApi.ts` + `plugins/api.ts` — слой `$api` над `$fetch`.
- `server/api/` — server routes: `GET /api/offers`, `POST /api/purchase`, `GET /api/entitlement?deviceId=…`.
- `server/utils/` — тарифы, zod-валидация, единый формат ошибок `{ data: { code } }`, доступ к БД (`Purchases.ts`, `Database.ts`).
- `server/db/` — схема Drizzle и SQL-миграции. Таблица `purchases`: `offer_id`, `price` (снимок цены), `device_id`, `created_at`, `expires_at`.
- `shared/types/` — типы и enum, общие для фронта и сервера.

## Деплой и БД

- **Netlify.** Nuxt собирается с пресетом Netlify, server routes становятся Netlify Functions, деплой из GitHub. Миграции запускаются перед сборкой (`netlify.toml`), поэтому код не попадёт на старую схему.
- **Neon Postgres + Drizzle.** Бесплатный serverless Postgres. Драйвер `neon-http` ходит в базу по HTTPS, без TCP-пула: в serverless-функциях держать пул негде. Drizzle даёт типизированную схему и миграции.

## AI-инструменты и что проверено руками

Использовался Claude Code: дизайн-бриф и макет в Figma (через MCP-плагин Talk to Figma), каркас, server routes, вёрстка.

Сам проверял и правил: архитектуру серверного слоя (вынесен store, типизированные ошибки, endpoint активного доступа вместо «последней покупки»), API-слой `$api`, enum вместо строковых литералов, типизацию props/emits; прошёл все сценарии в браузере, включая Offline и `simulate=error`; проверил записи покупок в Neon; разобрал миграции и SQL, который генерирует Drizzle. Совпадение с макетом сверено попиксельно на 390×844: Default ≈ 98%, Error ≈ 98.4%, Success ≈ 99.3%. Остаток — разница сглаживания шрифта между Figma и Chrome.

## Что упрощено

- Тарифы — константа на сервере, а не таблица в БД.
- `deviceId` — условный идентификатор без авторизации, подделать его может кто угодно. В реальном продукте покупку подтверждает квитанция App Store / Google Play и она привязана к аккаунту.
- Нет автотестов. Состояние Loading с макетом попиксельно не сверялось: оно показывается доли секунды.

## Что сделал бы за ещё 2 часа

- e2e-тесты сценариев на Playwright и визуальные регрессионные тесты против экспорта из Figma.
- Идемпотентность покупки (ключ запроса) и rate limit на `POST /api/purchase`.
- Разделить нативный мост на универсальный транспорт и события экрана; добавить обратный канал из приложения в webview.
- Карточку тарифа сделать компонентом с вариантами в Figma; анимации смены состояний с учётом `prefers-reduced-motion`.
