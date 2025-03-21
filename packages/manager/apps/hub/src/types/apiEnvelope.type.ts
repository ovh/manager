export type ApiEnvelope<Data extends any> = {
  data: Data;
  status: string;
};

export type ApiAggregateEnvelope<Data extends any> = {
  count: number;
  data: Data;
};
