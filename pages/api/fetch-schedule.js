import fetchSchedule from "../../lib/fetchSchedule";

export default async function handler(req, res) {
  try {
    const data = await fetchSchedule();

    // همیشه JSON برگردان
    if (data.error) {
      return res.status(200).json({ error: data.error, lines: [], date: data.date || null });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("API Error:", err);
    res.status(200).json({ error: "خطا در ارتباط با سرور. دوباره تلاش کنید.", lines: [], date: new Date().toLocaleDateString("fa-IR") });
  }
}
