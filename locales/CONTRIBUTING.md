# Contributing a New Language

Thank you for helping translate GitHub Repo Manager! 🌍

## How to add a new language

1. **Copy** `en.js` and rename it to your language code (e.g., `fr.js` for French, `ja.js` for Japanese).

2. **Translate** every value on the right-hand side of each key.
   - Keep all **keys** (left side) exactly as-is.
   - Keep all **`{0}`, `{1}`** placeholders — they are replaced with dynamic values at runtime.
   - Keep any **HTML tags** (`<strong>`, `<code>`, `<a>`) intact — only translate the surrounding text.

3. **Register** your language in [`popup.js`](../popup.js):
   - Find the `SUPPORTED_LANGS` array near the top of the file and add your entry:
     ```js
     const SUPPORTED_LANGS = [
       { code: 'vi', label: 'VI' },
       { code: 'en', label: 'EN' },
       { code: 'fr', label: 'FR' }, // ← add yours here
     ];
     ```

4. **Load** your locale file in [`popup.html`](../popup.html) — add a script tag before `popup.js`:
   ```html
   <script src="locales/fr.js"></script>
   ```

5. **Open a Pull Request** with your new locale file and the two small edits above.

## Language codes

Use standard [BCP 47](https://www.ietf.org/rfc/bcp/bcp47.txt) language codes:

| Code | Language   |
|------|------------|
| `vi` | Vietnamese |
| `en` | English    |
| `fr` | French     |
| `ja` | Japanese   |
| `ko` | Korean     |
| `zh` | Chinese    |
| `de` | German     |
| `es` | Spanish    |
| `pt` | Portuguese |

For the `dateLocale` key, use the matching locale string for
[`toLocaleDateString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString),
e.g. `'fr-FR'`, `'ja-JP'`, `'zh-CN'`.

## Questions?

Open an issue on GitHub — we're happy to help!
