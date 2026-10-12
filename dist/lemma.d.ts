export interface Token {
    /** Küçük harfe çevrilmiş, kesme işareti düzeltilmiş kelime. */
    word: string;
    start: number;
    end: number;
}
export declare function tokenize(text: string): Token[];
export declare function normalizeWord(word: string): string;
/**
 * Kelimenin olası kök hâlleri (isim, fiil, sıfat okumaları ve kendisi).
 * "ran" → [ran, run], "data" → [data, datum], "studies" → [studies, study].
 */
export declare function lemmaCandidates(word: string): string[];
/** Yapay zekâ yokken gösterilecek kök: kelimeden farklı olan ilk fiil/isim/sıfat okuması. */
export declare function bestLocalLemma(word: string): string;
