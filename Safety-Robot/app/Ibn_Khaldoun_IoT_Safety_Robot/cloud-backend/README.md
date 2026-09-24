# Safety Robot Simulation Backend

هذا backend يعالج JSON telemetry محاكى، ويتحقق من المدى والتسلسل، ويصنف القراءة إلى `normal` أو `watch` أو `critical`، ثم يسجل قرارًا تدقيقيًا. لا يحتوي على MQTT أو GSM أو WhatsApp أو صمام أو محرك أو اتصال بمنشأة.

## البدء

```bash
npm install
npm test
SIMULATION_ONLY=true npm start
```

| المسار | النتيجة |
|---|---|
| `POST /api/v1/telemetry` | يقبل عينة محاكية متحققة ويعيد incident وتوصية مراقبة. |
| `GET /api/v1/incidents` | يحتاج رمز مشغل في الإنتاج. |
| `GET /api/v1/audit` | يعرض الأحداث التدقيقية المحاكية. |
| `POST /api/v1/simulation/commands` | يسمح فقط بأوامر `simulate_*` ويعيد `delivery:not-attempted`. |

> لا تضف منفذًا لأوامر field control إلى هذا المسار. يجب أن يكون أي نظام تحكم فعلي منفصلًا ومصممًا ومراجعًا من فريق سلامة وتحكم مختص.
