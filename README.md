# Safety Robot — Industrial Safety IoT System

**نظام كشف الغاز والسلامة الصناعية القائم على Arduino مع إنذار فوري والسحابة.**

---

## ما هو Safety Robot؟

نظام ذكي للكشف عن تسرب الغاز وإدارة السلامة الصناعية, يعتمد على Arduino للكشف عن مستويات الغاز الخطير, مع إنذار فوري يشمل إرسال رسائل SMS وتفعيل إنذار صوتي. يوفر لوحة تحكم ويب تفاعلية لمراقبة الحالة ومعالجة الحوادث.

## المميزات الرئيسية

### الكشف والإنذار
- كشف الغاز (بولي ثionine, بتروليوم, غاز طبيعي)
- إنذار سمعي ومرئي فوري عند تجاوز الحد المسموح
- محاكاة النظام بالكامل على الجهاز دون الحاجة لمعدات إضافية
- إرسال إنذارات عبر SMS عند اكتشاف تسرب

### لوحة التحكم
- واجهة ويب تفاعلية تتيح:
  - عرض حالة المستشعرات في الوقت الحقيقي
  - عرض سجل الحوادث والتحذيرات
  - إدارة الإعدادات الأساسية
  - عرض مؤشرات السلامة

### البنية التقنية
- Arduino C++ (C/C++) — تحكم الميكروكنترولر
- Node.js — الخادم السحابي للتحليل والإنذار
- React — لوحة التحكم للمتصفح (أُزيل مجلد `src/redux/` غير المستخدم؛ لا اعتماد على Redux)
- ملفات التوثيق: معمارية النظام, بوابة التشغيل, مستندات السلامة

## البنية

```
Safety-Robot/
├── app/
│   └── Ibn_Khaldoun_IoT_Safety_Robot/
│       ├── dashboard/          # لوحة التحكم (React)
│       ├── cloud-backend/      # الخادم السحابي (Node.js)
│       ├── docs/               # التوثيق والمعمارية
│       └── firmware/           # Arduino C++
└── REPAIR_NOTES.md
```

## البدء السريع

### المتطلبات
- Arduino IDE (للمحاكاة)
- Node.js 18+ (للخادم السحابي)
- npm أو yarn (للوحة التحكم)

### تشغيل النظام
```bash
# 1. الخادم السحابي
cd Safety-Robot/app/Ibn_Khaldoun_IoT_Safety_Robot/cloud-backend
npm install
node src/app.js

# 2. لوحة التحكم
cd Safety-Robot/app/Ibn_Khaldoun_IoT_Safety_Robot/dashboard
npm install
npm start
```

### محاكاة النظام
يمكن محاكاة النظام بالكامل على الجهاز دون معدات إضافية عن طريق تعديل إعدادات default في ملفات الإعداد.

## التوثيق
- المعمارية: `app/.../docs/Architecture_ar.md`
- بوابة التشغيل: `app/.../docs/Commissioning_Gates_ar.md`
- مستندات السلامة: `app/.../docs/Safety_Boundaries_ar.md`

## الفريق
- Osama Mohamed Fathy — IT Systems Engineer & Intelligent Automation Architect
- Built as technical advisor for Ibn Khaldoun Educational Foundation
