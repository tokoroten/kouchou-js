// filepath: src/workers/kmeans.worker.ts
// K-meansクラスタリング Worker
import type { WorkerRequest, WorkerResponse } from './workerTypes';

function kmeans(data: number[][], k: number, maxIter = 100): { labels: number[]; centroids: number[][] } {
  // シンプルなK-means実装（本番用は最適化推奨）
  const n = data.length;
  const dim = data[0].length;
  let centroids = data.slice(0, k);
  let labels = new Array(n).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    // 割り当て
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let minIdx = 0;
      for (let j = 0; j < k; j++) {
        const dist = euclidean(data[i], centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          minIdx = j;
        }
      }
      labels[i] = minIdx;
    }
    // セントロイド更新
    const newCentroids = Array.from({ length: k }, () => Array(dim).fill(0));
    const counts = Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      counts[labels[i]]++;
      for (let d = 0; d < dim; d++) {
        newCentroids[labels[i]][d] += data[i][d];
      }
    }
    for (let j = 0; j < k; j++) {
      if (counts[j] > 0) {
        for (let d = 0; d < dim; d++) {
          newCentroids[j][d] /= counts[j];
        }
      } else {
        newCentroids[j] = data[Math.floor(Math.random() * n)];
      }
    }
    if (JSON.stringify(centroids) === JSON.stringify(newCentroids)) break;
    centroids = newCentroids;
  }
  return { labels, centroids };
}

function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

self.onmessage = (event) => {
  const req = event.data as WorkerRequest<{ data: number[][]; k: number }>;
  try {
    const { data, k } = req.payload;
    const { labels, centroids } = kmeans(data, k);
    const result: WorkerResponse = {
      type: 'clustering',
      result: { labels, centroids },
    };
    self.postMessage(result);
  } catch (e) {
    const error: WorkerResponse = {
      type: 'clustering',
      error: String(e),
    };
    self.postMessage(error);
  }
};
