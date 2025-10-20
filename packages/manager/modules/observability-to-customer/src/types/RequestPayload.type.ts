export type RequestPayload = {
  type: 'query' | 'query_range';
  query: string;
  start: number;
  end: number;
  step: number;
};
