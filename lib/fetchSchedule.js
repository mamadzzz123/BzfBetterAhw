import fs from "fs";
import path from "path";

// فانکشن برای خواندن فایل PDF محلی
async function readLocalPdf() {
  try {
    const filePath = path.join(process.cwd(), "lib", "file.pdf"); // اسم فایل خودتو بذار
    const buffer = fs.readFileSync(filePath);

    // اگه pdf-parse یا مشابه داری:
    // const data = await pdfParse(buffer);
    // return data.text;

    return "متن تستی از PDF محلی"; // فعلاً نمونه
  } catch (err) {
    console.error("readLocalPdf Error:", err);
    return "";
  }
}

// استخراج خطوط
function extractLinesForKeywords(text) {
  if (!text) return [];
  return text.split("\n").slice(0, 10);
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

    const lines = extractLinesForKeywords(text);
    const date = new Date().toLocaleDateString("fa-IR");

    return { source: "local-pdf", date, lines };
  } catch (err) {
    console.error("fetchSchedule Error:", err);
    return {
      error: "خطا در خواندن فایل PDF.",
      lines: [],
      date: new Date().toLocaleDateString("fa-IR")
    };
  }
}
