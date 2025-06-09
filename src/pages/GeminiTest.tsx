import { useState } from 'react';
import { runGeminiNanoPrompt, checkGeminiNanoUsable, runGeminiNanoPromptWithSchema } from '../lib/geminiNanoClient';
import { isGeminiNanoAvailable } from '../lib/geminiNanoDetect';

// 分析タイプの定義
type AnalysisType = 'summary' | 'sentiment' | 'keywords' | 'themes';

// 分析タイプごとのプロンプトテンプレート
const analysisPrompts: Record<AnalysisType, string> = {
  summary: '次の市民意見を50文字程度で簡潔に要約してください。\n\n',
  sentiment: '次の市民意見の感情を「ポジティブ」「ニュートラル」「ネガティブ」のいずれかで分類し、理由を簡潔に説明してください。\n\n',
  keywords: '次の市民意見から重要なキーワードを5つ抽出し、箇条書きで列挙してください。\n\n',
  themes: '次の市民意見から主要なテーマや課題を3つ特定し、簡潔に説明してください。\n\n',
};

export default function GeminiTest() {
  // 自由入力テストデータ（市民意見分析・可視化に関する質問）
  const [prompt, setPrompt] = useState(
    '市民意見の分析において、テキストマイニングと可視化の効果的な組み合わせ方法を3つ教えてください。また、それぞれの手法がどのような種類の意見データに適しているか、具体例を交えて説明してください。'
  );
  
  // 意見分析テストデータ（複数のトピックと感情が混在する市民意見）
  const [opinion, setOpinion] = useState(
    '新しい総合文化センターについて意見します。建物のデザインが現代的で街のランドマークになっており、とても誇らしく思います。図書館スペースが広くなり、静かな読書コーナーと子ども向けの賑やかなエリアが分かれているのは良い工夫だと感じます。ただ、駐車場の台数が以前より減ってしまったため、休日は満車になることが多く不便です。また、カフェスペースのメニューの種類が少なく、値段も少し高いので改善の余地があると思います。高齢者向けのIT講習会など新しい試みは素晴らしいですが、平日昼間しか開催されないため、働いている世代は参加できません。夜間や週末にも同様のプログラムを検討していただきたいです。全体的には以前より格段に良くなっていますが、運営面でいくつか改善点があります。'
  );
  
  const [analysisType, setAnalysisType] = useState<AnalysisType>('summary');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'analysis' | 'json'>('prompt');
  
  // JSONスキーマの詳細な例（市民意見の多角的分析用）
  const [jsonSchema, setJsonSchema] = useState<string>(
    `{
  "type": "object",
  "properties": {
    "sentiment": {
      "type": "string",
      "enum": ["ポジティブ", "やや肯定的", "中立", "やや否定的", "ネガティブ", "複合的"],
      "description": "意見全体のトーンを評価"
    },
    "summary": {
      "type": "string",
      "description": "50文字以内の簡潔な要約"
    },
    "mainTopics": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "topic": { "type": "string" },
          "sentiment": { "type": "string", "enum": ["ポジティブ", "ニュートラル", "ネガティブ"] },
          "importance": { "type": "number", "minimum": 1, "maximum": 5 }
        },
        "required": ["topic", "sentiment"]
      },
      "description": "言及されている主要トピック（最大3つ）"
    },
    "keywords": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 5,
      "description": "重要なキーワード（最大5つ）"
    },
    "suggestions": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 2,
      "description": "意見から導き出される改善提案（最大2つ）"
    }
  },
  "required": ["sentiment", "summary", "mainTopics", "keywords"]
}`
  );
  
  // JSON分析用のリアルな市民意見サンプル
  const [jsonPrompt, setJsonPrompt] = useState<string>(
    '次の市民意見を分析してください：「市の防災計画について意見します。先月の防災訓練は非常に有意義でした。特に高齢者や障がい者の避難支援についての実践的な取り組みは、地域の連携を強化するのに役立ったと思います。しかし、災害時の情報伝達方法にはまだ課題があります。停電時にスマホの充電ができなくなった場合、どのように情報を得るのかが明確になっていません。また、避難所として指定されている小学校の収容人数が地域住民数に対して少なすぎるのではないかと心配しています。水害の危険がある地域には特に配慮が必要だと思います。次回の訓練では、より実際の災害状況に近い形での訓練を希望します。」'
  );
  const [jsonResponse, setJsonResponse] = useState<string>('');

  // APIの状態をチェック
  const checkApiStatus = async () => {
    try {
      setApiStatus('確認中...');
      const isAvailable = await isGeminiNanoAvailable();
      
      if (isAvailable) {
        const result = await checkGeminiNanoUsable();
        if (result.ok) {
          setApiStatus('APIは正常に動作しています ✅');
        } else {
          setApiStatus(`API利用不可: ${result.error || '不明なエラー'} ❌`);
        }
      } else {
        setApiStatus('Gemini Nano APIは利用できません ❌');
      }
    } catch (err) {
      setApiStatus(`ステータス確認エラー: ${err instanceof Error ? err.message : String(err)} ❌`);
    }
  };
  // プロンプトを送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');
    
    try {
      const result = await runGeminiNanoPrompt(prompt);
      setResponse(result);
    } catch (err) {
      console.error('Gemini実行エラー:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // 意見分析を実行
  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const fullPrompt = analysisPrompts[analysisType] + opinion;
      console.log('分析プロンプト:', fullPrompt);
      
      const result = await runGeminiNanoPrompt(fullPrompt);
      setResponse(result);
    } catch (err) {
      console.error('意見分析エラー:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Implementing the JSON Schema handler function
  const handleJsonSchemaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonPrompt.trim() || !jsonSchema.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');
    
    try {
      // Parse the JSON schema
      const schema = JSON.parse(jsonSchema);
      console.log('JSON Schema:', schema);
      
      // Call the function with schema
      const result = await runGeminiNanoPromptWithSchema(jsonPrompt, schema);
      
      // Format the result for display
      const formattedResult = JSON.stringify(result, null, 2);
      setJsonResponse(formattedResult);
      setResponse(formattedResult);
      
      console.log('Schema構造化結果:', result);
    } catch (err) {
      console.error('JSON Schema実行エラー:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text'>
          Gemini Nano 動作テスト
        </h1>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300'>API状態確認</h2>
          <div className='flex flex-wrap items-center gap-4'>
            <button
              onClick={checkApiStatus}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              APIステータスチェック
            </button>
            {apiStatus && (
              <span className={`${apiStatus.includes('❌') ? 'text-red-500' : 'text-green-500'}`}>
                {apiStatus}
              </span>
            )}
          </div>
        </div>

        {/* タブ切り替え */}
        <div className='flex border-b border-gray-200 dark:border-gray-700 mb-6'>
          <button
            className={`py-3 px-6 ${
              activeTab === 'prompt'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('prompt')}
          >
            自由入力
          </button>
          <button
            className={`py-3 px-6 ${
              activeTab === 'analysis'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            意見分析
          </button>
          <button
            className={`py-3 px-6 ${
              activeTab === 'json'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('json')}
          >
            JSONスキーマ
          </button>
        </div>

        {activeTab === 'prompt' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300'>Gemini Nanoにプロンプトを送信</h2>
            
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='ここに質問を入力してください...'
                  className='w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none'
                />
              </div>
              
              <button
                type='submit'
                disabled={loading || !prompt.trim()}
                className={`px-5 py-2.5 text-white rounded-lg ${
                  loading || !prompt.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? '処理中...' : '送信'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300'>市民意見の分析</h2>
            
            <form onSubmit={handleAnalysis}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  分析タイプ:
                </label>
                <div className='flex flex-wrap gap-3'>
                  <label className='inline-flex items-center'>
                    <input
                      type='radio'
                      className='form-radio'
                      name='analysisType'
                      checked={analysisType === 'summary'}
                      onChange={() => setAnalysisType('summary')}
                    />
                    <span className='ml-2'>要約</span>
                  </label>
                  
                  <label className='inline-flex items-center'>
                    <input
                      type='radio'
                      className='form-radio'
                      name='analysisType'
                      checked={analysisType === 'sentiment'}
                      onChange={() => setAnalysisType('sentiment')}
                    />
                    <span className='ml-2'>感情分析</span>
                  </label>
                  
                  <label className='inline-flex items-center'>
                    <input
                      type='radio'
                      className='form-radio'
                      name='analysisType'
                      checked={analysisType === 'keywords'}
                      onChange={() => setAnalysisType('keywords')}
                    />
                    <span className='ml-2'>キーワード抽出</span>
                  </label>
                  
                  <label className='inline-flex items-center'>
                    <input
                      type='radio'
                      className='form-radio'
                      name='analysisType'
                      checked={analysisType === 'themes'}
                      onChange={() => setAnalysisType('themes')}
                    />
                    <span className='ml-2'>テーマ特定</span>
                  </label>
                </div>
              </div>
              
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  市民意見:
                </label>
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  placeholder='ここに分析したい市民意見テキストを入力してください...'
                  className='w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none'
                />
              </div>
              
              <button
                type='submit'
                disabled={loading || !opinion.trim()}
                className={`px-5 py-2.5 text-white rounded-lg ${
                  loading || !opinion.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? '分析中...' : '分析実行'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'json' && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300'>JSONスキーマを使用した分析</h2>
            
            <form onSubmit={handleJsonSchemaSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  JSONスキーマ:
                </label>
                <textarea
                  value={jsonSchema}
                  onChange={(e) => setJsonSchema(e.target.value)}                  placeholder='ここにJSONスキーマを入力してください...'
                  className='w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm'
                />
              </div>
              
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  市民意見:
                </label>
                <textarea
                  value={jsonPrompt}
                  onChange={(e) => setJsonPrompt(e.target.value)}
                  placeholder='ここに分析したい市民意見テキストを入力してください...'
                  className='w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none'
                />
              </div>
              
              <button
                type='submit'
                disabled={loading || !jsonPrompt.trim() || !jsonSchema.trim()}
                className={`px-5 py-2.5 text-white rounded-lg ${
                  loading || !jsonPrompt.trim() || !jsonSchema.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? '分析中...' : '分析実行'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className='mt-6 p-4 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded'>
            <p className='font-bold'>エラー</p>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className='mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6'>
            <h3 className='text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300'>
              {activeTab === 'prompt' ? 'Gemini Nanoの回答:' : '分析結果:'}
            </h3>
            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
              <pre className='whitespace-pre-wrap text-gray-800 dark:text-gray-200'>{response}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
