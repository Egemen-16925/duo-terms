# duo-terms

[DuoPDF](https://github.com/Egemen-16925/Duopdf) ve [Firelingo](https://github.com/Egemen-16925/firelingo) arasında paylaşılan terim mantığı. İki uygulama aynı kelime havuzunu kullandığı için aynı kelimenin iki tarafta **aynı anahtara** düşmesi gerekir; bu paket o kodun tek kaynağıdır.

- `tokenize`, `normalizeWord`, `lemmaCandidates`, `bestLocalLemma` — İngilizce kelimeleri ayırma ve yerel kök bulma (`wink-lemmatizer`)
- `patternFor`, `mergePatterns`, `buildMatcher` — terim kalıbı ve metinde eşleştirme ("ran / running → run", "carried out → carry out")
- `termKey` — terimin kararlı anahtarı
- `cleanText`, `sentenceKey` — cümle çevirilerinin kararlı anahtarı (temizlenmiş metnin SHA-256'sı)

## Kurulum

npm'de yayınlanmaz; git etiketiyle kurulur:

```bash
npm install github:Egemen-16925/duo-terms#v1.1.0
```

```ts
import { termKey, patternFor, buildMatcher, tokenize } from "duo-terms";

termKey("Carry  Out"); // "carry out"
const matcher = buildMatcher([{ id: "run", status: "unknown", pattern: patternFor(["ran"], ["run"]) }]);
matcher.findExact(tokenize("running"))?.id; // "run"
```

`buildMatcher` terim kimliğinin türünü korur: DuoPDF sayısal `id`, Firelingo terim anahtarı kullanır.

## Geliştirme

```bash
npm install
npm test
npm run build
```

Derlenmiş `dist/` klasörü depoda tutulur, çünkü git bağımlılığı olarak kurulan paket derlenmeden kullanılır. Kod değişince `npm run build` çalıştır, `dist/`'i de commit'le, sürümü yükselt ve yeni bir `vX.Y.Z` etiketi at.

**Davranışı değiştiren her değişiklik iki uygulamayı da etkiler:** anahtar ya da kalıp üretimi değişirse eski kayıtlar yeni kayıtlarla eşleşmeyebilir.

## Lisans

MIT
