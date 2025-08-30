// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fetch-schedule")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setData({ error: "خطا در تماس با سرور" });
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: "Tahoma, Arial", minHeight: "100vh", background: "linear-gradient(135deg,#f6f8ff,#eef7f5)", padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "white", borderRadius: 16, boxShadow: "0 8px 30px rgba(15,23,42,0.08)", padding: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>زمان‌بندی قطعی برق — اهواز (سپیدار / بلوار فنی‌حرفه‌ای / خیابان مهارت)</h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>اطلاع‌رسانی خودکار از منابع رسمی شرکت توزیع برق</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <small style={{ color: "#9ca3af" }}>آخرین به‌روزرسانی</small>
            <div style={{ fontWeight: 600 }}>{new Date().toLocaleString("fa-IR")}</div>
          </div>
        </header>

        <main>
          {loading && <div>در حال دریافت اطلاعات...</div>}

          {!loading && data?.error && (
            <div style={{ padding: 16, background: "#fff7ed", borderRadius: 10, color: "#92400e" }}>
              <strong>خطا:</strong> {data.error}
            </div>
          )}

          {!loading && !data?.error && (
            <>
              <section style={{ marginBottom: 16 }}>
                <div style={{ color: "#374151" }}>تاریخ در اطلاعیه: <strong>{data.date || "-"}</strong></div>
                <div style={{ color: "#374151", marginTop: 8 }}>منبع: <a href={data.source} target="_blank" rel="noreferrer">{data.source}</a></div>
              </section>

              <section>
                <h3 style={{ marginBottom: 8 }}>نتایج یافت‌شده برای منطقهٔ شما</h3>
                {data.lines && data.lines.length > 0 ? (
                  <ul style={{ paddingLeft: 18 }}>
                    {data.lines.map((l, i) => (
                      <li key={i} style={{ marginBottom: 8, lineHeight: 1.5 }}>
                        {l}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: 12, borderRadius: 8, background: "#eef2ff", color: "#3730a3" }}>
                    در اطلاعیهٔ آخر به‌صورت مستقیم خطی شامل عبارت‌های «سپیدار / بلوار فنی / مهارت» پیدا نشد. (ممکن است منطقه تحت عنوان بلوک/محلهٔ دیگری ذکر شده باشد.)
                  </div>
                )}
              </section>
            </>
          )}
        </main>

        <footer style={{ marginTop: 20, color: "#6b7280", fontSize: 13 }}>
          اگر چیزی پیدا نشد: ممکن است جدول امروز منتشر نشده باشد یا نام محله در فایل متفاوت نوشته شده باشد. می‌توانم کلیدواژه‌ها را دقیق‌تر کنم یا برایت قابلیت ایمیل/تلگرام اضافه کنم.
        </footer>
      </div>
    </div>
  );
}
