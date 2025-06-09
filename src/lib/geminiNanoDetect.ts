// filepath: src/lib/geminiNanoDetect.ts
// Gemini Nano 機能検出システム実装

// Gemini Nanoモデルダウンロード状態判定（LanguageModel API利用）
export async function getGeminiModelDownloadStatus(): Promise<'not-supported' | 'downloading' | 'available' | 'error'> {
  try {
    if (
      typeof window === 'undefined' ||
      typeof (window as unknown as { LanguageModel?: unknown }).LanguageModel !== 'object'
    ) {
      return 'not-supported';
    }
    const status = await (
      window as unknown as { LanguageModel: { availability: () => Promise<string> } }
    ).LanguageModel.availability();
    if (status === 'available') return 'available';
    if (status === 'downloadable') return 'downloading';
    return 'error';
  } catch {
    return 'error';
  }
}

export function isAiFlagEnabled(): boolean {
  return typeof window !== 'undefined' && typeof (window as unknown as { ai?: unknown }).ai === 'object';
}

export function isGeminiModelDownloaded(): boolean {
  return typeof window !== 'undefined' && (window as any).ai && (window as any).ai.modelInfo;
}

export function isGeminiNanoAvailable(): boolean {
  return isAiFlagEnabled() && isGeminiModelDownloaded();
}

export function isGeminiNanoAvailableSync(): boolean {
  // 旧来の同期判定（即時UI用）
  return isAiFlagEnabled();
}

export function getGeminiNanoInfo(): string {
  if (!isAiFlagEnabled()) return 'chrome://flags/#enable-ai を有効化してください';
  if (!isGeminiModelDownloaded()) return 'chrome://components/ でGemini Nanoモデルをダウンロードしてください';
  // ここまで通れば有効
  const ai = (window as any).ai;
  if (ai.modelInfo && ai.modelInfo.model) {
    return `Gemini Nano: 利用可能 (model: ${ai.modelInfo.model})`;
  }
  return 'Gemini Nano: 利用可能';
}

export function getGeminiNanoInfoSync(): string {
  if (!isAiFlagEnabled()) return 'chrome://flags/#enable-ai を有効化してください';
  return 'Gemini Nano: 利用可能（モデルダウンロード状況は下記参照）';
}
