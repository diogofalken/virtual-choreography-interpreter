export interface FileDataRetrievalStrategy {
  retrieveData(path: string): Promise<{ columns: string[]; rows: string[][] }>;
  toObjectArray(columns: string[], rows: string[][]): Record<string, string>[];
}
