import { useAppStore } from '../store';

export default function Progress() {
  const { isLoading, error, currentSessionId, sessions } = useAppStore();
  const current = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">処理進行状況</h2>
      <div className="mb-4">
        <div className="font-bold">現在のセッション: </div>
        <div className="mb-2">{current ? `${current.name} (${current.id})` : '未選択'}</div>
      </div>
      <div className="mb-4">
        <div className="font-bold">進行状況</div>
        <ul className="list-disc ml-6">
          <li>CSVアップロード: {current?.csvData ? '完了' : '未処理'}</li>
          <li>意見成形: {current?.processedOpinions ? '完了' : '未処理'}</li>
          <li>UMAP次元削減: {current?.umapModelId ? '完了' : '未処理'}</li>
          {/* 必要に応じて他の進捗も追加 */}
        </ul>
      </div>
      {isLoading && <div className="text-blue-500">処理中...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
