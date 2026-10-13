/** PDF'ten gelen metni düzeltir: satır sonu tirelemesini birleştirir, boşlukları sadeleştirir. */
export declare function cleanText(text: string): string;
/** Cümlenin cihazdan ve uygulamadan bağımsız anahtarı: temizlenmiş metnin SHA-256 özeti. */
export declare function sentenceKey(text: string): Promise<string>;
