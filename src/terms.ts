import { normalizeWord } from "./lemma.js";

/** Terimin cihazlar ve uygulamalar arası kararlı anahtarı: küçük harfli kök hâli ("run", "carry out"). */
export function termKey(lemma: string): string {
  return lemma.trim().split(/\s+/).map(normalizeWord).join(" ");
}

/** Aynı terim yeniden işaretlenince kalıpları birleştirir; kelime sayısı farklıysa eskisi kalır. */
export function mergePatterns(a: string[][], b: string[][]): string[][] {
  if (a.length !== b.length) return a;
  return a.map((keys, i) => [...new Set([...keys, ...b[i]])]);
}
