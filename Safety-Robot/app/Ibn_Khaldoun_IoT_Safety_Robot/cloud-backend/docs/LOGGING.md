# Structured Logging — Safety Robot cloud-backend

- الوحدة: `src/jsonLogger.js` (stdlib فقط: `JSON.stringify` + `node:async_hooks`، بلا اعتماديات جديدة).
- السكيما لكل سطر JSON: `timestamp` (UTC ISO-8601 ms) + `level` + `service` + `env` + `version` + `request_id` + `event` + `message`.
- المستويات عبر `LOG_LEVEL` (debug/info/warn/error، الافتراضي `info` للإنتاج و`debug` للتطوير). `warn`/`error` تخرج على stderr والباقي على stdout.
- الربط في `src/app.js` فقط: `requestIdMiddleware` (يقرأ `X-Request-ID` أو يولّد واحدًا، يعيده في الرد، ويسجّل سطر وصول واحد `http.access`: method + path + status + duration — بلا query strings أو ترويسات أو أجسام) + استبدال `console.log` في مسار التشغيل (سطر الإقلاع `server.start`) بـ `logger.info`. الاختبارات لم تُمس.
- المتغيرات (`.env.example`): `SERVICE_NAME=safety-robot-cloud-backend`، `LOG_LEVEL=info`، `GIT_SHA=dev`، و`NODE_ENV` للبيئة.
- الأسرار: تقنيع تلقائي (`***`) للحقول الحساسة (password/token/secret/authorization/cookie/…). ممنوع تسجيل أسرار حقيقية. المحاكاة فقط — لا تشغيل لأجهزة ميدانية.
