import fs from "fs";
import path from "path";
// اگه pdf-parse داری، آن‌کامنـت کن
// import pdfParse from "pdf-parse";

// خواندن PDF محلی
async function readLocalPdf() {
  try {
    const filePath = path.join(process.cwd(), "lib", "file.pdf"); // اسم PDF خودتو بذار
    const buffer = fs.readFileSync(filePath);

    // اگه pdf-parse نصبه:
    // const data = await pdfParse(buffer);
    // return data.text;

    return "نمونه متن تستی از PDF ..."; // جایگزین موقت
  } catch (err) {
    console.error("readLocalPdf Error:", err);
    return "";
  }
}

// جستجوی آدرس داخل متن
function findScheduleForLocation(text, keywords) {
  if (!text) return [];

  const lines = text.split("\n").map(l => l.trim());
  const results = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some(k => lower.includes(k.toLowerCase()))) {
      results.push(line);
    }
  }

  return results;
}

// فانکشن اصلی
export default async function fetchSchedule() {
  try {
    const text = await readLocalPdf();

    if (!text) {
      return {
        error: "هیچ فایل PDF محلی پیدا نشد.",
        date: new Date().toLocaleDateString("fa-IR"),
        lines: []
      };
    }

    // کلیدواژه‌ها: هرچی بخوای می‌تونی اضافه کنی
    const keywords = ["بلوار فن"];

    const results = findScheduleForLocation(text, keywords);

    return {
      source: "local-pdf",
      date: new Date().toLocaleDateString("fa-IR"),
      lines: results.length ? results : ["هیچ موردی پیدا نشد."]
    };
  } catch (err) {
    console.error("fetchSchedule Error:", err);
    return {
      error: "خطا در خواندن فایل PDF.",
      lines: [],
      date: new Date().toLocaleDateString("fa-IR")
    };
  }
}

