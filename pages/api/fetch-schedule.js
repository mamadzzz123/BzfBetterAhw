// pages/api/fetch-schedule.js
import fetchSchedule from "../../lib/fetchSchedule";

export default async function handler(req, res) {
  try {
    const data = await fetchSchedule();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600"); // قفل cache برای Vercel
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "خطا در دریافت اطلاعات" });
  }
}
