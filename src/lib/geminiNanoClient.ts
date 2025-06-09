// filepath: src/lib/geminiNanoClient.ts
// Chrome Built-in AI API クライアント実装（仮）

export async function runGeminiNanoPrompt(prompt: string): Promise<string> {
  if (typeof window === 'undefined' || typeof (window as any).ai !== 'object') {
    throw new Error('Gemini Nano API未対応ブラウザ');
  }
  // textPromptの存在チェック
  if (typeof (window as any).ai.textPrompt !== 'function') {
    throw new Error('Gemini Nano API: textPromptメソッドが未実装です。Chrome Canary/DevのAI機能が有効な環境でのみ利用できます。');
  }
  try {
    // @ts-ignore
    const result = await window.ai.textPrompt({ prompt });
    return result?.text ?? '';
  } catch (e) {
    throw new Error('Gemini Nano APIエラー: ' + String(e));
  }
}

/**
 * Gemini Nano APIが実際に利用可能かをテストリクエストで判定する
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function checkGeminiNanoUsable(): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === 'undefined' || typeof (window as any).ai !== 'object') {
    return { ok: false, error: 'Gemini Nano API未対応ブラウザ' };
  }
  if (typeof (window as any).ai.textPrompt !== 'function') {
    return { ok: false, error: 'Gemini Nano API: textPromptメソッドが未実装です。Chrome Canary/DevのAI機能が有効な環境でのみ利用できます。' };
  }
  try {
    // 実際に短いテストプロンプトでAPIを呼ぶ
    // @ts-ignore
    const result = await window.ai.textPrompt({ prompt: 'ping' });
    if (result && typeof result.text === 'string') {
      return { ok: true };
    } else {
      return { ok: false, error: 'Gemini Nano API: 応答が不正です。' };
    }
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
