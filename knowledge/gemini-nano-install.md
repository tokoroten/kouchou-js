# Chrome Gemini Nano インストール手順（2025年6月最新版）
https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?pli=1&tab=t.0

## フラグの有効化
1. Chromeのアドレスバーに `chrome://flags/#prompt-api-for-gemini-nano` を入力し「Enabled」に設定。
2. `chrome://flags/#optimization-guide-on-device-model` を「Enabled (BypassPerfRequirement)」に設定。
3. Chromeを「Relaunch」ボタンで再起動。

## Gemini Nanoの有効化確認
1. DevTools（F12）を開き、コンソールで次を実行 ：
   ```js
   await LanguageModel.availability();
   ```
   - "available" が返ればセットアップ完了です。

2 `downloadable` が返る場合は、次の手順でダウンロードを開始します。
   ```js
   await LanguageModel.create();
   ```
   - これでGemini Nanoがダウンロードされます。


await LanguageModel.availability();の返り値は次の通り
- "available"：Gemini Nanoが利用可能
- "downloadable"：Gemini Nanoがダウンロード可能だが、まだダウンロードされていない状態、モデルの作成を通じて、ダウンロードが実行される
- "unavailable"：Gemini Nanoが利用できない状態（初期化途中など）

## Gemini Nanoの使い方

```js
model = await LanguageModel.create();
result = await model.prompt("helloworld");
console.log(result);
```
