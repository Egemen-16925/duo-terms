/** PDF'ten gelen metni düzeltir: satır sonu tirelemesini birleştirir, boşlukları sadeleştirir. */
export function cleanText(text: string): string {
  return text
    .replace(/(\p{L})-\s*\n?\s+(\p{Ll})/gu, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Cümlenin cihazdan ve uygulamadan bağımsız anahtarı: temizlenmiş metnin SHA-256 özeti. */
export function sentenceKey(text: string): Promise<string> {
  return sha256(cleanText(text));
}
