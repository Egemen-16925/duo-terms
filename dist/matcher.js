import { lemmaCandidates } from "./lemma.js";
function tokenMatches(token, keys) {
    return lemmaCandidates(token.word).some((c) => keys.has(c));
}
export function buildMatcher(terms) {
    // İlk kelimenin anahtarlarına göre dizin; uzun terimler önce denensin.
    const byFirstKey = new Map();
    const compiled = terms
        .filter((t) => t.pattern.length > 0)
        .map((term) => ({ term, keys: term.pattern.map((p) => new Set(p)) }))
        .sort((a, b) => b.keys.length - a.keys.length);
    for (const c of compiled) {
        for (const key of c.keys[0]) {
            const list = byFirstKey.get(key) ?? [];
            if (!list.includes(c))
                list.push(c);
            byFirstKey.set(key, list);
        }
    }
    function candidatesAt(tokens, i) {
        const seen = new Set();
        for (const key of lemmaCandidates(tokens[i].word)) {
            for (const c of byFirstKey.get(key) ?? [])
                seen.add(c);
        }
        return [...seen].sort((a, b) => b.keys.length - a.keys.length);
    }
    function matchAt(tokens, i, c) {
        if (i + c.keys.length > tokens.length)
            return false;
        return c.keys.every((keys, k) => tokenMatches(tokens[i + k], keys));
    }
    return {
        findAll(tokens) {
            const matches = [];
            let i = 0;
            while (i < tokens.length) {
                const hit = candidatesAt(tokens, i).find((c) => matchAt(tokens, i, c));
                if (hit) {
                    const last = i + hit.keys.length - 1;
                    matches.push({ termId: hit.term.id, status: hit.term.status, first: i, last });
                    i = last + 1;
                }
                else {
                    i++;
                }
            }
            return matches;
        },
        findExact(tokens) {
            if (tokens.length === 0)
                return undefined;
            return candidatesAt(tokens, 0).find((c) => c.keys.length === tokens.length && matchAt(tokens, 0, c))?.term;
        },
    };
}
/** Tıklanan/seçilen kelimelerden ve (varsa) modelin verdiği kökten terim kalıbı üretir. */
export function patternFor(surfaceWords, lemmaWords = []) {
    return surfaceWords.map((word, i) => {
        const keys = new Set(lemmaCandidates(word));
        // Model kökü kelime sayısı aynıysa o konuma eklenir ("ran" → "run").
        if (lemmaWords.length === surfaceWords.length) {
            for (const c of lemmaCandidates(lemmaWords[i]))
                keys.add(c);
        }
        return [...keys];
    });
}
