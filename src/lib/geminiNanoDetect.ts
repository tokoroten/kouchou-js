// filepath: src/lib/geminiNanoDetect.ts
// Gemini Nano 機能検出システム実装

export function isGeminiNanoAvailable(): boolean {
  // Chromeのwindow.ai APIの存在チェック（仮実装）
  // Canary/Dev版でのみ有効
  return typeof window !== 'undefined' && typeof (window as any).ai === 'object';
}

export function getGeminiNanoInfo(): string {
  if (!isGeminiNanoAvailable()) return 'Gemini Nano: 未対応ブラウザ';
  // 追加情報取得（バージョン等）
  return 'Gemini Nano: 利用可能';
}
