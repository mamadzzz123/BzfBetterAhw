// lib/fetchSchedule.js
const res = await fetch(url);
import pdf from "pdf-parse";
import * as cheerio from "cheerio";

const BASE = "https://kepdc.co.ir"; // سایت رسمی شرکت توزیع برق خوزستان

// کلیدواژه‌هایی که باید در متن جستجو شوند:
const KEYWORDS = ["سپیدار", "بلوار فنی", "فنی و حرفه", "خیابان مهارت", "مهارت"];

export async function findLatestPdfLink() {
  // صفحهٔ اطلاعیه‌ها یا اخبار که pdfها را لیست می‌کند
  const pageUrl = `${BASE}/`; // اگر نیاز بود آدرس دقیق صفحه رو تغییر بده
  const res = await fetch(pageUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  const $ = cheerio.load(html);

  // تلاش می‌کنیم لینک‌هایی که به pdf اشاره دارند را بیابیم و آخرینشان را برگردانیم
  const links = [];
  $("a").each((i, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    if (href.toLowerCase().endsWith(".pdf") || href.includes("pdf")) {
      const full = href.startsWith("http") ? href : (href.startsWith("/") ? (BASE + href) : (BASE + "/" + href));
      links.push(full);
    }
  });

  // اگر لینک پیدا نشد، تلاش جزئی‌تر: دنبال anchor text با "خاموشی" یا "جدول خاموشی" باش
  if (links.length === 0) {
    $("a").each((i, el) => {
      const text = $(el).text();
      const href = $(el).attr("href") || "";
      if (/خاموشی|قطعی|جدول/i.test(text) && href) {
        const full = href.startsWith("http") ? href : (href.startsWith("/") ? (BASE + href) : (BASE + "/" + href));
        links.push(full);
      }
    });
  }

  // برگردان آخرین لینک یا null
  return links.length ? links[0] : null;
}

export async function downloadPdfText(pdfUrl) {
  const r = await fetch(pdfUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error("Failed to download PDF: " + r.status);
  const buffer = await r.arrayBuffer();
  const data = await pdf(Buffer.from(buffer));
  return data.text; // متن استخراج‌شده
}

export function extractLinesForKeywords(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const matches = [];
  for (const line of lines) {
    for (const k of KEYWORDS) {
      if (line.includes(k)) {
        matches.push(line);
        break;
      }
    }
  }
  return matches;
}

export function guessDateFromText(text) {
  // تلاش برای پیدا کردن تاریخ شمسی یا میلادی در متن (ساده)
  const persianDate = text.match(/(\d{1,2}\s?\/\s?\d{1,2}\s?\/\s?\d{2,4})|(\d{4}\/\d{1,2}\/\d{1,2})/);
  if (persianDate) return persianDate[0];
  const g = text.match(/\d{1,2}\s?شهریور|\d{1,2}\s?مرداد|\d{1,2}\s?آبان|\d{1,2}\s?/i);
  if (g) return g[0];
  return null;
}

export default async function fetchSchedule() {
  // 1. پیدا کردن آخرین pdf
  const pdfLink = await findLatestPdfLink();
  if (!pdfLink) return { error: "هیچ فایل PDF قابل دسترسی پیدا نشد." };

  // 2. دانلود و استخراج متن
  const text = await downloadPdfText(pdfLink);

  // 3. پیدا کردن خطوط مرتبط
  const lines = extractLinesForKeywords(text);

  // 4. تلاش برای پیدا کردن تاریخ داخل متن
  const date = guessDateFromText(text) || new Date().toLocaleDateString("fa-IR");

  return {
    source: pdfLink,
    date,
    lines
  };
}
