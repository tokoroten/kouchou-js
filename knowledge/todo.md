# 広聴AI js 開発TODO

## Phase 1: プロジェクト基盤構築
- [ ] Vite + React + TypeScript プロジェクトセットアップ
- [ ] ESLint + Prettier 設定
- [ ] Tailwind CSS 設定
- [ ] Zustand 状態管理セットアップ
- [ ] IndexedDB wrapper 作成
- [ ] 基本ルーティング設定

## Phase 2: データ処理基盤
- [ ] Web Workers アーキテクチャ設計
- [ ] CSV Parser Worker 実装
- [ ] Papa Parse ライブラリ統合
- [ ] データ検証システム実装
- [ ] セッション管理システム実装

## Phase 3: AI・分析機能
- [ ] OpenAI API クライアント実装
- [ ] 意見成形 Worker 実装
- [ ] エンベディング Worker 実装
- [ ] UMAP-js 統合と Worker 実装
- [ ] K-means クラスタリング Worker 実装
- [ ] 要約生成システム実装

## Phase 4: UI実装
- [ ] ダッシュボード画面
- [ ] CSVアップロード画面
- [ ] 設定画面（API設定・パラメータ）
- [ ] 処理進行状況画面
- [ ] 可視化画面（plotly.js統合）
- [ ] エクスポート機能

## Phase 5: 最適化・品質向上
- [ ] エラーハンドリング強化
- [ ] パフォーマンス最適化
- [ ] プログレッシブ処理機能
- [ ] テスト実装
- [ ] ドキュメント整備

## 優先実装項目
1. プロジェクト基盤（Vite + React + TypeScript）
2. セッション管理とIndexedDB統合
3. CSV アップロード機能
4. 基本的なWeb Worker アーキテクチャ
5. OpenAI API統合

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