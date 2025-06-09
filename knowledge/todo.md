# 広聴AI js 開発TODO

## 割り込みTODO
- [ ] 設定画面に Gemini nano の動作確認のためのボタンを追加、任意のテキストを入力して、Gemini nano の動作確認ができるようにする。
- [ ] gemini nano のインストールが確認できない場合、Gemini nano のインストール方法を表示する。


## Phase 1: プロジェクト基盤構築
- [x] Vite + React + TypeScript プロジェクトセットアップ
- [x] ESLint + Prettier 設定
- [x] Tailwind CSS 設定
- [x] Zustand 状態管理セットアップ
- [x] IndexedDB wrapper 作成
- [x] 基本ルーティング設定

## Phase 2: データ処理基盤
- [x] Web Workers アーキテクチャ設計
- [x] CSV Parser Worker 実装
- [x] Papa Parse ライブラリ統合
- [x] データ検証システム実装
- [x] セッション管理システム実装

## Phase 3: AI・分析機能
- [x] Gemini Nano 機能検出システム実装
- [x] Chrome Built-in AI API クライアント実装
- [x] 意見成形 Worker 実装（Gemini Nano）
- [x] エンベディング Worker 実装（Sentence Transformers）
- [x] UMAP-js 統合と Worker 実装
- [x] K-means クラスタリング Worker 実装
- [x] 要約生成システム実装（Gemini Nano）

## Phase 4: UI実装
- [x] ダッシュボード画面
- [x] CSVアップロード画面
- [x] 設定画面（Gemini Nano設定・パラメータ）
- [x] 処理進行状況画面
- [x] 可視化画面（plotly.js統合）
- [x] エクスポート機能

## Phase 5: 最適化・品質向上
- [x] エラーハンドリング強化
- [ ] パフォーマンス最適化
- [ ] プログレッシブ処理機能
- [ ] テスト実装
- [ ] ドキュメント整備

## 優先実装項目
1. プロジェクト基盤（Vite + React + TypeScript）
2. セッション管理とIndexedDB統合
3. CSV アップロード機能
4. Gemini Nano機能検出
5. 基本的なWeb Worker アーキテクチャ

## 技術的課題
- [ ] UMAPモデルのシリアライゼーション方法検討
- [ ] 大容量データのメモリ効率処理
- [ ] Web WorkerとMainThreadの効率的通信
- [ ] APIレート制限への対応戦略
- [ ] ブラウザ互換性確保

## 注意事項
- 各Phase完了時にビルド確認を必須とする
- エラーハンドリングは各機能実装時に同時実装
- UIはレスポンシブ対応を前提とする
- セキュリティ（APIキー管理等）を常に考慮する