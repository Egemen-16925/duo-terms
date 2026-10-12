import { lemmaCandidates, type Token } from "./lemma.js";

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

interface CompiledTerm<Id> {
  term: MatchableTerm<Id>;
  keys: Set<string>[];
}

export interface Matcher<Id = number> {
  findAll(tokens: Token[]): TermMatch<Id>[];
  /** Belirli token aralığını tam olarak kapsayan terim (tıklanan kelime/öbek için). */
  findExact(tokens: Token[]): MatchableTerm<Id> | undefined;
}

function tokenMatches(token: Token, keys: Set<string>): boolean {
  return lemmaCandidates(token.word).some((c) => keys.has(c));
}

export function buildMatcher<Id = number>(terms: MatchableTerm<Id>[]): Matcher<Id> {
  // İlk kelimenin anahtarlarına göre dizin; uzun terimler önce denensin.
  const byFirstKey = new Map<string, CompiledTerm<Id>[]>();
  const compiled = terms
    .filter((t) => t.pattern.length > 0)
    .map((term) => ({ term, keys: term.pattern.map((p) => new Set(p)) }))
    .sort((a, b) => b.keys.length - a.keys.length);
  for (const c of compiled) {
    for (const key of c.keys[0]) {
      const list = byFirstKey.get(key) ?? [];
      if (!list.includes(c)) list.push(c);
      byFirstKey.set(key, list);
    }
  }

  function candidatesAt(tokens: Token[], i: number): CompiledTerm<Id>[] {
    const seen = new Set<CompiledTerm<Id>>();
    for (const key of lemmaCandidates(tokens[i].word)) {
      for (const c of byFirstKey.get(key) ?? []) seen.add(c);
    }
    return [...seen].sort((a, b) => b.keys.length - a.keys.length);
  }

  function matchAt(tokens: Token[], i: number, c: CompiledTerm<Id>): boolean {
    if (i + c.keys.length > tokens.length) return false;
    return c.keys.every((keys, k) => tokenMatches(tokens[i + k], keys));
  }

  return {
    findAll(tokens) {
      const matches: TermMatch<Id>[] = [];
      let i = 0;
      while (i < tokens.length) {
        const hit = candidatesAt(tokens, i).find((c) => matchAt(tokens, i, c));
        if (hit) {
          const last = i + hit.keys.length - 1;
          matches.push({ termId: hit.term.id, status: hit.term.status, first: i, last });
          i = last + 1;
        } else {
          i++;
        }
      }
      return matches;
    },
    findExact(tokens) {
      if (tokens.length === 0) return undefined;
      return candidatesAt(tokens, 0).find((c) => c.keys.length === tokens.length && matchAt(tokens, 0, c))?.term;
    },
  };
}

/** Tıklanan/seçilen kelimelerden ve (varsa) modelin verdiği kökten terim kalıbı üretir. */
export function patternFor(surfaceWords: string[], lemmaWords: string[] = []): string[][] {
  return surfaceWords.map((word, i) => {
    const keys = new Set(lemmaCandidates(word));
    // Model kökü kelime sayısı aynıysa o konuma eklenir ("ran" → "run").
    if (lemmaWords.length === surfaceWords.length) {
      for (const c of lemmaCandidates(lemmaWords[i])) keys.add(c);
    }
    return [...keys];
  });
}
