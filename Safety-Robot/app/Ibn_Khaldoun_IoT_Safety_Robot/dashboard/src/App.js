import React, { useMemo, useState } from "react";

const initial = { deviceId: "simulation-unit", gasIndex: 120, temperatureC: 27, smokeIndex: 5, severity: "normal", lastAudit: "لم تصل قراءات بعد" };

function classify({ gasIndex, temperatureC, smokeIndex }) {
  if (gasIndex >= 500 || temperatureC >= 85 || smokeIndex >= 500) return "critical";
  if (gasIndex >= 350 || temperatureC >= 65 || smokeIndex >= 300) return "watch";
  return "normal";
}

export default function App() {
  const [state, setState] = useState(initial);
  const [message, setMessage] = useState("الوضع: محاكاة فقط. لا توجد أوامر حقل أو رسائل خارجية.");
  const status = useMemo(() => classify(state), [state]);
  const ingestSample = () => {
    const next = { ...state, gasIndex: state.gasIndex >= 500 ? 120 : 620, severity: state.gasIndex >= 500 ? "normal" : "critical", lastAudit: `تم تسجيل عينة محاكاة عند ${new Date().toLocaleTimeString("ar-SA")}` };
    setState(next); setMessage(next.severity === "critical" ? "حالة محاكاة حرجة: راجع المشغل المؤهل. لم ينفذ أي فعل ميداني." : "عينة محاكاة طبيعية مسجلة.");
  };
  return <main dir="rtl" style={{ fontFamily: "system-ui", maxWidth: 1080, margin: "0 auto", padding: 28, background: "#08141c", color: "#effaf6", minHeight: "100vh" }}>
    <header><p style={{ color: "#75e6bf" }}>SAFETY ROBOT · SIMULATION CONSOLE</p><h1>لوحة مراقبة ومحاكاة السلامة</h1><p>تعرض مؤشرات telemetry وسجل قرار برمجي؛ لا تحل محل نظام حماية ميداني معتمد.</p></header>
    <section style={{ padding: 16, borderRight: "4px solid #eab34e", background: "#10232e", margin: "18px 0" }}><strong>قيد تشغيلي:</strong> إغلاق/فتح الصمام والملاحة المستقلة وSMS/WhatsApp ومزود MQTT الخارجي محظورة في هذه النسخة.</section>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
      {[["الغاز", `${state.gasIndex} index`], ["الحرارة", `${state.temperatureC} °C`], ["الدخان", `${state.smokeIndex} index`], ["التصنيف", status]].map(([label, value]) => <article key={label} style={{ background: "#10232e", border: "1px solid #24414b", padding: 18, borderRadius: 14 }}><small>{label}</small><h2>{value}</h2></article>)}
    </section>
    <section style={{ background: "#10232e", padding: 18, borderRadius: 14, marginTop: 18 }}><h2>سير العمل المقيد</h2><p>{message}</p><p><strong>آخر سجل:</strong> {state.lastAudit}</p><button type="button" onClick={ingestSample} style={{ padding: "10px 16px", cursor: "pointer" }}>إدخال عينة محاكاة</button><button type="button" disabled style={{ marginRight: 8, padding: "10px 16px" }}>أوامر ميدانية — محظورة</button></section>
  </main>;
}
