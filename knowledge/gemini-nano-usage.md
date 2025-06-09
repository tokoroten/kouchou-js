# Gemini Nano 使用ガイド

## 概要

Gemini Nanoとは、Google Chrome内に組み込まれたオンデバイスAIモデルです。インターネット接続なしでAI機能を使用可能で、プライバシー保護にも優れています。このドキュメントでは、広聴AIプロジェクト内でGemini Nanoを活用するための方法を説明します。

## セットアップ手順

1. **Chromeフラグの有効化**
   - アドレスバーに `chrome://flags/#prompt-api-for-gemini-nano` を入力し「Enabled」に設定
   - `chrome://flags/#optimization-guide-on-device-model` を「Enabled (BypassPerfRequirement)」に設定
   - Chromeを「Relaunch」ボタンで再起動

2. **初期化確認**
   - 開発者ツール（F12）を開き、コンソールで確認：
   ```js
   await LanguageModel.availability();
   ```

3. **モデルダウンロード**（返り値が"downloadable"の場合）
   ```js
   await LanguageModel.create();
   ```

## 広聴AIでのGemini Nano活用方法

### 1. テキスト分析

Gemini Nanoは市民意見のテキスト分析に活用できます：

- 意見の要約生成
- 感情分析（ポジティブ/ネガティブ判定）
- キーワード抽出
- テーマやカテゴリの自動分類

### 2. データ可視化サポート

分析結果をより意味のある形で表示：

- クラスタラベル自動生成
- データポイントの説明生成
- 傾向の要約

### 3. テキスト埋め込み（エンベディング）

OpenAIのテキストエンベディングをオフラインで代替：

- プライバシー保護が重要な場面での活用
- インターネット接続がない環境での実行

## 実装例

### 基本的な使用方法

```typescript
// モデルの初期化
const model = await window.LanguageModel.create();

// プロンプト送信
const result = await model.prompt("市民の意見を要約してください: " + text);
console.log(result); // 結果表示
```

### システムプロンプト付き対話

```typescript
const chat = await model.startChat({
  history: [
    {
      role: "system",
      parts: "あなたは市民意見を分析する専門家です。文章から重要なポイントを抽出し、簡潔に要約してください。"
    }
  ]
});

const result = await chat.sendMessage("道路の補修について多くの要望があります。[...]");
console.log(result.text());
```

## 構造化出力 (JSON Schema)

Gemini Nanoは、JSON Schemaを使用して構造化された形式でレスポンスを生成することができます。この機能は以下のような用途に役立ちます：

- 複数の情報を一度に抽出（感情、キーワード、要約など）
- データ構造を固定して一貫性のある分析結果を取得
- ダッシュボードや可視化などのための構造化データ出力

### 基本使用方法

```typescript
import { runGeminiNanoPromptWithSchema } from '../lib/geminiNanoClient';

// JSONスキーマを定義
const schema = {
  type: "object",
  properties: {
    sentiment: {
      type: "string",
      enum: ["ポジティブ", "ニュートラル", "ネガティブ"]
    },
    keywords: {
      type: "array",
      items: {
        type: "string"
      }
    },
    summary: {
      type: "string"
    }
  },
  required: ["sentiment", "keywords", "summary"]
};

// スキーマを使ってプロンプトを実行
const result = await runGeminiNanoPromptWithSchema(
  '次の市民意見を分析してください：「公園の整備は素晴らしいですが、ゴミ箱が足りません。」',
  schema
);

console.log(result);
// 出力例:
// {
//   sentiment: "ポジティブ",
//   keywords: ["公園", "整備", "素晴らしい", "ゴミ箱", "不足"],
