import * as cheerio from "cheerio"; // اصلاح ایمپورت
// اگر قبلا node-fetch داشتی، دیگه لازم نیست

// فانکشن نمونه برای پیدا کردن آخرین PDF
async function findLatestPdfLink() {
  try {
    const res = await fetch("https://www.aepdco.ir/جدول-خاموشی-(دانلود)"); // لینک واقعی قطعی برق
    if (!res.ok) throw new Error("Failed to fetch source page");
    const html = await res.text();
    const $ = cheerio.load(html);
    const links = $("a").map((i, el) => $(el).attr("href")).get();
    const pdfLinks = links.filter(link => link?.endsWith(".pdf"));
    return pdfLinks[0] || null;
  } catch (err) {
    console.error("findLatestPdfLink Error:", err);
    return null;
  }
}

// فانکشن نمونه برای دانلود متن PDF
async function downloadPdfText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to download PDF");
    const buffer = await res.arrayBuffer();
    // اگر pdf-parse یا مشابه نصب داری:
    // const data = await pdfParse(Buffer.from(buffer));
    // return data.text;
    return "متن نمونه PDF"; // fallback ساده
  } catch (err) {
    console.error("downloadPdfText Error:", err);
    return "";
  }
}

// استخراج خطوط موردنظر از متن
function extractLinesForKeywords(text) {
  // نمونه ساده: هر خط متن رو جدا کن
  if (!text) return [];
  return text.split("\n").slice(0, 10); // ۱۰ خط اول برای نمایش
}

// تاریخ گرفتن از متن
function guessDateFromText(text) {
  // نمونه ساده: تاریخ امروز
  return new Date().toLocaleDateString("fa-IR");
}

// فانکشن اصلی
export default async function fetchSchedule() {
  try {
    const pdfLink = await findLatestPdfLink();
    if (!pdfLink) return { error: "هیچ فایل PDF پیدا نشد.", date: new Date().toLocaleDateString("fa-IR"), lines: [] };

    const text = await downloadPdfText(pdfLink);
    const lines = extractLinesForKeywords(text);
    const date = guessDateFromText(text) || new Date().toLocaleDateString("fa-IR");

    return { source: pdfLink, date, lines };
  } catch (err) {
    console.error("fetchSchedule Error:", err);
    return { error: "خطا در دریافت اطلاعات از سرور.", lines: [], date: new Date().toLocaleDateString("fa-IR") };
  }
}

