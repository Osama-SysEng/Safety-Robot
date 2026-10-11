# PRD — Safety-Robot (Ibn Khaldoun IoT Safety Robot)
## 1. نظرة عامة
- Backend محاكاة (Node/Express في `cloud-backend/src/app.js`).
- يقبل telemetry JSON محاكى ويتحقق من المدى/التسلسل.
- يصنف القراءة `normal|watch|critical` ويسجل قرارًا تدقيقيًا.
- لا MQTT/GSM/WhatsApp/صمام/محرك/اتصال منشأة.
- أوامر المحاكاة فقط (`simulate_*`) بلا تنفيذ ميداني.
## 2. المستخدمون
1. جهاز محاكى يرسل telemetry (بدون auth).
2. مشغّل يقرأ الحوادث/التدقيق والأوامر عبر رمز (`X-Operator-Token` إنتاجًا).
3. مدقق سلامة يراجع سجل القرارات.
## 3. الميزات الأساسية (قابلة للاختبار)
1. قبول `POST /telemetry` صالح (202 + incident وتوصية مراقبة).
2. رفض telemetry خارج الحدود بـ400 (`invalid telemetry`).
3. رفض JSON المشوه بـ400 مع حدث `telemetry_rejected`.
4. تصنيف `normal|watch|critical` حسب `gasIndex/smokeIndex/temperatureC`.
5. قائمة `/incidents` بترقيم (`limit/offset`, الأحدث أولًا).
6. قائمة `/audit` بترقيم (`limit/offset`).
7. طلب أمر محاكاة `simulate_inspect|simulate_stop|simulate_alert` فقط (202).
8. الأمر المحاكى يعيد `status:simulation-recorded` و`delivery:not-attempted`.
9. رفض الأوامر غير `simulate_*` أو غياب الهوية بـ409.
10. فحص `/health` (`simulation-only|locked`) + حد معدل + ترويسات أمان + 404 JSON.
## 4. الـAPI endpoints الحقيقية (من الكود فقط)
- `POST /api/v1/telemetry` — 202 | 400.
- `GET /api/v1/incidents?limit=&offset=` — operator guard.
- `GET /api/v1/audit?limit=&offset=` — operator guard.
- `GET /api/v1/simulation/commands` — operator guard.
- `POST /api/v1/simulation/commands` — 202 | 409.
- `GET /health` — `{status:ok, mode}`.
## 5. بيانات الدخول/الإعداد للاختبار
- من `cloud-backend/`: `npm install && npm test`.
- التشغيل: `SIMULATION_ONLY=true npm start` (منفذ `config.port`).
- مثال telemetry: `{deviceId:"sim-1", occurredAt:<ms>, sequence:1`.
- تابع: `location:{lat,lng}, readings:{gasIndex:0–10000, temperatureC:-40–180, smokeIndex:0–10000}}`.
- مثال أمر: `{deviceId:"sim-1", command:"simulate_inspect", operator:"op-1"}`.
- الاختبار: `npm test` (`test/safety-core.test.js`).
## 6. خارج النطاق (mocked/simulated — صراحة)
- لا تحكم ميداني: `delivery:not-attempted` دائمًا.
- أي تحكم فعلي يجب أن يكون نظامًا منفصلًا مصممًا ومراجعًا.
- ادعاءات `Project_Brief` (Arduino/GPS/servo/WiFi/GSM/remote-control/SMS) غير منفذة هنا.
- `SafetyRobotSimulationOnly.ino` محاكاة فقط.
- القراءات/المواقع عينات يدوية لا مستشعرات حية.
- لا تضف منفذ field-control لهذا المسار (README صراحة).
