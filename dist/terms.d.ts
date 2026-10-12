/** Terimin cihazlar ve uygulamalar arası kararlı anahtarı: küçük harfli kök hâli ("run", "carry out"). */
export declare function termKey(lemma: string): string;
/** Aynı terim yeniden işaretlenince kalıpları birleştirir; kelime sayısı farklıysa eskisi kalır. */
export declare function mergePatterns(a: string[][], b: string[][]): string[][];
