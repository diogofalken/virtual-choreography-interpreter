export interface DataRetrievalStrategy {
  readData(): Promise<any>;
  analyzeData(): Promise<any>;
}
