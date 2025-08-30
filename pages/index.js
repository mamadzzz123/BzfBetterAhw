import { useEffect, useState } from "react";

export default function Home() {
  const [lines, setLines] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fetch-schedule")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setLines([]);
          setDate(data.date);
        } else {
          setLines(data.lines);
          setDate(data.date);
          setError(null);
        }
        setLoading(false);
      })
      .catch(e => {
        setError("خطا در اتصال به سرور");
        setLines([]);
        setDate(new Date().toLocaleDateString("fa-IR"));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>زمان قطعی برق سپیدار</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <p>تاریخ: {date}</p>
      <ul>
        {lines.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
