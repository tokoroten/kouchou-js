// Gemini Nanoモデルのダウンロードを開始し、進捗を監視するユーティリティ
// 利用前提: Chrome Canary/Dev + 必要なflags有効

/**
 * Gemini Nanoモデルのダウンロードを開始し、状態を監視する
 * @returns {Promise<'available' | 'downloading' | 'unavailable' | 'not-supported' | 'error'>}
 */
export async function ensureGeminiNanoModelDownloaded(): Promise<'available' | 'downloading' | 'unavailable' | 'not-supported' | 'error'> {
  try {
    if (
      typeof window === 'undefined' ||
      typeof (window as unknown as { LanguageModel?: unknown }).LanguageModel !== 'object'
    ) {
      return 'not-supported';
    }
    // 現在の状態を取得
    const status = await (
      window as unknown as { LanguageModel: { availability: () => Promise<string>; create: () => Promise<string|void> } }
    ).LanguageModel.availability();
    if (status === 'available') return 'available';
    if (status === 'downloadable') {
      // ダウンロード開始を明示的にトリガー
      let createResult: string | void = undefined;
      try {
        createResult = await (
          window as unknown as { LanguageModel: { create: () => Promise<string|void> } }
        ).LanguageModel.create();
      } catch (e) {
        // create()は失敗してもよい（仕様通り）
      }
      if (createResult === 'unavailable') {
        // unavailableは「ダウンロード中・初期化中」などの一時的な状態
        return 'unavailable';
      }
      // 少し待ってから再度状態確認
      for (let i = 0; i < 30; i++) { // 最大30回(約30秒)リトライ
        await new Promise(res => setTimeout(res, 1000));
        const newStatus = await (
          window as unknown as { LanguageModel: { availability: () => Promise<string> } }
        ).LanguageModel.availability();
        if (newStatus === 'available') return 'available';
        if (newStatus === 'downloadable') continue;
        if (newStatus === 'unavailable') return 'unavailable';
        return 'error';
      }
      return 'downloading'; // 30秒経ってもavailableにならなければダウンロード中
    }
    if (status === 'unavailable') return 'unavailable';
    return 'error';
  } catch {
    return 'error';
  }
}
