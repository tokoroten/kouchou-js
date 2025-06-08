// filepath: src/lib/validateCsv.ts
// データ検証システム実装
import type { CsvParserResponse } from '../workers/workerTypes';

export interface CsvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    rowCount: number;
    columnCount: number;
    columns: string[];
    missingRequired: string[];
  };
  sample: any[];
}

// 必須カラム
const REQUIRED_COLUMNS = ['opinion'];

export function validateCsv(parsed: CsvParserResponse): CsvValidationResult {
  const errors: string[] = [...parsed.errors];
  const warnings: string[] = [];
  const columns = parsed.fields;
  const missingRequired = REQUIRED_COLUMNS.filter((col) => !columns.includes(col));
  if (missingRequired.length > 0) {
    errors.push(`必須カラムが不足: ${missingRequired.join(', ')}`);
  }
  if (parsed.data.length === 0) {
    errors.push('データ行がありません');
  }
  // サンプルデータ
  const sample = parsed.data.slice(0, 5);
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      rowCount: parsed.data.length,
      columnCount: columns.length,
      columns,
      missingRequired,
    },
    sample,
  };
}
