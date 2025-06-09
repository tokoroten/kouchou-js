# Chrome Gemini Nano インストール手順（2025年6月最新版）
https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?pli=1&tab=t.0

## 事前準備
- Googleの「生成AI禁止用途ポリシー」に同意してください。
- Chrome Canary（バージョン128.0.6545.0以上）をダウンロードし、インストールしてください。
- デバイス要件を満たしていることを確認してください。
  - 特に「空きストレージ22GB以上」が必要です。
  - ダウンロード後に空き容量が10GB未満になるとモデルが自動削除されます。
  - macOSの場合は「ディスクユーティリティ」で正確な空き容量を確認してください。

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
2. 失敗した場合は次の手順 ：
   - コンソールで `await LanguageModel.create();` を実行（失敗してもOK）
   - Chromeを再起動
   - 新しいタブで `chrome://components` を開き、「On-Device AI」または「Gemini Nano」コンポーネントが表示されているか確認
   - 「Optimization Guide On Device Model」のバージョンが `2024.5.21.1031` 以上であることを確認
   - バージョンが表示されない場合は「Check for update」をクリック
   - ダウンロード完了後、再度 `await LanguageModel.availability();` を実行し "available" になるか確認
   - それでも失敗する場合は、Chromeを完全終了→再起動し、再度上記手順を繰り返してください

## 注意事項
- 上記は2025年6月時点の公式情報に基づきます。Chromeのバージョンや仕様変更により手順が変わる場合があります。
- Gemini Nanoは一部の環境・地域でのみ利用可能な場合があります。
- トラブル時は公式ドキュメントのトラブルシューティングセクションを参照してください