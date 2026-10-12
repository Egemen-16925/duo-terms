import { type Token } from "./lemma.js";
export type TermStatus = "unknown" | "learning" | "known";
/**
 * Eşleştirme için gereken en küçük terim bilgisi.
 * `Id`: uygulamanın terim kimliği (DuoPDF'te sayısal id, Firelingo'da terim anahtarı).
 */
export interface MatchableTerm<Id = number> {
    id: Id;
    status: TermStatus;
    /** Her kelime konumu için kabul edilen kök anahtarları. "carry out" → [[carry, carried…], [out]] */
    pattern: string[][];
}
export interface TermMatch<Id = number> {
    termId: Id;
    status: TermStatus;
    /** Eşleşen ilk ve son token'ın sırası (son dahil). */
    first: number;
    last: number;
}
export interface Matcher<Id = number> {
    findAll(tokens: Token[]): TermMatch<Id>[];
    /** Belirli token aralığını tam olarak kapsayan terim (tıklanan kelime/öbek için). */
    findExact(tokens: Token[]): MatchableTerm<Id> | undefined;
}
export declare function buildMatcher<Id = number>(terms: MatchableTerm<Id>[]): Matcher<Id>;
/** Tıklanan/seçilen kelimelerden ve (varsa) modelin verdiği kökten terim kalıbı üretir. */
export declare function patternFor(surfaceWords: string[], lemmaWords?: string[]): string[][];
