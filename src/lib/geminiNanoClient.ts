// filepath: src/lib/geminiNanoClient.ts
// Chrome Built-in AI API クライアント実装

// LanguageModelの型定義を拡張
interface LanguageModelAPI {
  availability: () => Promise<string>;
  create: () => Promise<unknown>;
}

// JSON Schemaの型定義
interface JSONSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  [key: string]: any;
}

interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  description?: string;
  [key: string]: any;
}

// プロンプトのオプション型
interface GeminiNanoOptions {
  schema?: JSONSchema;
  system?: string;
}

// Windowオブジェクトの拡張は geminiNanoDetect.ts に定義済み
// LanguageModelインスタンスの型定義
interface GeminiNanoModel {
  prompt: (text: string, options?: GeminiNanoOptions) => Promise<GeminiResponse>;
}

// Gemini Nanoの応答型
type GeminiResponse = 
  | string
  | {
      text?: string;
      content?: string;
      [key: string]: unknown;
    };

export async function runGeminiNanoPrompt(prompt: string): Promise<string> {
  if (typeof window === 'undefined' || !window.LanguageModel) {
    throw new Error('Gemini Nano API未対応ブラウザ');
  }
  try {
    console.log('Gemini Nanoモデル作成開始');
    // LanguageModel.create()でモデルインスタンスを取得
    const model = await (window.LanguageModel as LanguageModelAPI).create() as GeminiNanoModel;
    console.log('Gemini Nanoモデル作成完了', model);
    
    if (!model || typeof model.prompt !== 'function') {
      throw new Error('Gemini Nano: model.promptが利用できません');
    }
    
    console.log('プロンプト送信:', prompt);
    const result = await model.prompt(prompt);
    console.log('応答結果:', result);
    
    // 返却値に応じた適切な処理
    if (typeof result === 'string') {
      return result;
    }
    
    if (typeof result === 'object' && result !== null) {
      if (typeof result.text === 'string' && result.text) {
        return result.text;
      }
      if (typeof result.content === 'string' && result.content) {
        return result.content;
      }
    }
    
    return typeof result === 'object' ? JSON.stringify(result) : String(result);
  } catch (e) {
    console.error('Gemini Nano API実行エラー:', e);
    throw new Error('Gemini Nano APIエラー: ' + String(e));
  }
}

/**
 * Gemini Nano APIが実際に利用可能かをテストリクエストで判定する
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function checkGeminiNanoUsable(): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === 'undefined' || !window.LanguageModel) {
    return { ok: false, error: 'Gemini Nano API未対応ブラウザ' };
  }
  
  try {
    const model = await (window.LanguageModel as LanguageModelAPI).create() as GeminiNanoModel;
    
    if (!model || typeof model.prompt !== 'function') {
      return { ok: false, error: 'Gemini Nano: model.promptが利用できません' };
    }
    
    const result = await model.prompt('ping');
    
    // 返却値の型に応じた処理
    if (typeof result === 'string' && result.length > 0) {
      return { ok: true };
    }
    
    if (typeof result === 'object' && result !== null) {
      if (typeof result.text === 'string' && result.text.length > 0) {
        return { ok: true };
      }
      if (typeof result.content === 'string' && result.content.length > 0) {
        return { ok: true };
      }
    }
    
    return { ok: false, error: 'Gemini Nano: 応答が不正です。' };
  } catch (e) {
    console.error('Gemini Nano使用可能性チェックエラー:', e);
    return { ok: false, error: String(e) };
  }
}

/**
 * JSON Schemaを使用してGemini Nanoにプロンプトを送信し、構造化された応答を取得する
 * @param prompt プロンプト文字列
 * @param schema 応答の構造を定義するJSON Schema
 * @param system オプションのシステムプロンプト
 * @returns 構造化されたデータ（JSONオブジェクト）
 */
export async function runGeminiNanoPromptWithSchema<T>(
  prompt: string, 
  schema: JSONSchema,
  system?: string
): Promise<T> {
  if (typeof window === 'undefined' || !window.LanguageModel) {
    throw new Error('Gemini Nano API未対応ブラウザ');
  }
  
  try {
    console.log('Gemini Nanoモデル作成開始（Schema指定）');
    // LanguageModel.create()でモデルインスタンスを取得
    const model = await (window.LanguageModel as LanguageModelAPI).create() as GeminiNanoModel;
    console.log('Gemini Nanoモデル作成完了', model);
    
    if (!model || typeof model.prompt !== 'function') {
      throw new Error('Gemini Nano: model.promptが利用できません');
    }
    
    // オプションを構築
    const options: GeminiNanoOptions = {
      schema: schema
    };
    
    // システムプロンプトが指定されている場合は追加
    if (system) {
      options.system = system;
    }
    
    console.log('スキーマ付きプロンプト送信:', prompt);
    console.log('使用スキーマ:', schema);
    if (system) console.log('システムプロンプト:', system);
    
    const result = await model.prompt(prompt, options);
    console.log('応答結果:', result);
    
    // 結果がオブジェクト形式の場合
    if (typeof result === 'object' && result !== null) {
      // JSONとして解析できる文字列が含まれている場合
      if (typeof result.text === 'string' && result.text) {
        try {
          const jsonResult = JSON.parse(result.text);
          return jsonResult as T;
        } catch (e) {
          console.warn('JSON解析エラー (text):', e);
        }
      }
      
      if (typeof result.content === 'string' && result.content) {
        try {
          const jsonResult = JSON.parse(result.content);
          return jsonResult as T;
        } catch (e) {
          console.warn('JSON解析エラー (content):', e);
        }
      }
      
      // オブジェクトが直接返ってきた場合
      return result as unknown as T;
    }
    
    // 文字列の場合、JSONとして解析を試みる
    if (typeof result === 'string') {
      try {
        const jsonResult = JSON.parse(result);
        return jsonResult as T;
      } catch (e) {
        console.warn('JSON解析エラー (string):', e);
        throw new Error('Gemini Nano API応答が有効なJSONではありません: ' + result);
      }
    }
    
    throw new Error('Gemini Nano API応答が期待形式ではありません');
  } catch (e) {
    console.error('Gemini Nano API実行エラー (JSON):', e);
    throw new Error('Gemini Nano APIエラー: ' + String(e));
  }
}
