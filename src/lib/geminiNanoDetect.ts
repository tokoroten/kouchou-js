// filepath: src/lib/geminiNanoDetect.ts
// Gemini Nano 機能検出システム実装

// LanguageModelの型定義を拡張
interface LanguageModelAPI {
  availability: () => Promise<string>;
  create: () => Promise<any>;
}

// Windowオブジェクトの拡張
declare global {
  interface Window {
    LanguageModel?: LanguageModelAPI | Function;
  }
}

// Gemini Nanoモデルダウンロード状態判定（LanguageModel API利用）
export async function getGeminiModelDownloadStatus(): Promise<'not-supported' | 'downloading' | 'available' | 'error'> {
  try {
    // LanguageModelが存在するか確認（関数やオブジェクトとして存在する場合がある）
    if (
      typeof window === 'undefined' ||
      !window.LanguageModel
    ) {
      console.log('LanguageModel not found, type:', typeof window.LanguageModel);
      return 'not-supported';
    }
    
    console.log('LanguageModel found, type:', typeof window.LanguageModel);
    const status = await (window.LanguageModel as LanguageModelAPI).availability();
    console.log('LanguageModel availability status:', status);
    
    if (status === 'available') return 'available';
    if (status === 'downloadable') return 'downloading';
    return 'error';
  } catch (err) {
    console.error('Error checking Gemini status:', err);
    return 'error';
  }
}

// LanguageModel APIベースの判定に統一
export async function isGeminiNanoAvailable(): Promise<boolean> {
  try {
    // LanguageModelが存在するか確認
    if (
      typeof window === 'undefined' ||
      !window.LanguageModel
    ) {
      return false;
    }
    
    const status = await (window.LanguageModel as LanguageModelAPI).availability();
    return status === 'available';
  } catch (err) {
    console.error('Error checking Gemini availability:', err);
    return false;
  }
}

export async function getGeminiNanoInfo(): Promise<string> {
  try {
    // LanguageModelが存在するか確認
    if (
      typeof window === 'undefined' ||
      !window.LanguageModel
    ) {
      return 'Gemini Nano: 未対応ブラウザ/flag未設定（chrome://flags で有効化が必要です）';
    }
    
    const status = await (window.LanguageModel as LanguageModelAPI).availability();
    if (status === 'available') return 'Gemini Nano: 利用可能';
    if (status === 'downloadable') return 'Gemini Nano: ダウンロード可能（LanguageModel.create()でダウンロード開始）';
    if (status === 'unavailable') return 'Gemini Nano: 初期化中または一時的に利用不可';
    return `Gemini Nano: 状態不明(${status})`;
  } catch (err) {
    console.error('Error getting Gemini info:', err);
    return 'Gemini Nano: 状態取得エラー - ' + (err instanceof Error ? err.message : String(err));
  }
}

// 即時UI用の同期判定（window.LanguageModel有無のみ）
export function isGeminiNanoAvailableSync(): boolean {
  return typeof window !== 'undefined' && !!window.LanguageModel;
}
