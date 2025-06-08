// filepath: src/lib/geminiNanoClient.ts
// Chrome Built-in AI API クライアント実装（仮）

export async function runGeminiNanoPrompt(prompt: string): Promise<string> {
  if (typeof window === 'undefined' || typeof (window as any).ai !== 'object') {
    throw new Error('Gemini Nano API未対応ブラウザ');
  }
  // 仮: window.ai.textPrompt APIを呼び出す（実際のAPIはChrome Canary/Dev限定）
  try {
    // @ts-ignore
    const result = await window.ai.textPrompt({ prompt });
    return result?.text ?? '';
  } catch (e) {
    throw new Error('Gemini Nano APIエラー: ' + String(e));
  }
}
