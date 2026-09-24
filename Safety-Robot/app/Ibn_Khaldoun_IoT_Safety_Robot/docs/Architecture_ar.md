# المعمارية المقترحة للمحاكاة والمراقبة

```text
Simulation harness
  → validated telemetry API
  → schema / range / sequence checks
  → simulation incident + immutable-style audit event
  → Arabic simulation dashboard

No MQTT broker · No public device topic · No field command · No SMS/WhatsApp
```

تقسم هذه المعمارية بين **المراقبة البرمجية** و**طبقة الحماية الميدانية**. المشروع المرفق يحقق الجانب الأول في بيئة محاكاة فقط. طبقة الحماية الميدانية إن طُلبت مستقبلًا ينبغي أن تكون منفصلة هندسيًا، ولا تثق بالشبكة أو لوحة الويب أو LLM أو backend في تنفيذ وظيفة أمان مباشرة.
