export type ApiEnvelope<Data> = {
  data: Data;
  status: string;
};

export type ApiAggregateEnvelope<Data> = {
  count: number;
  data: Data;
};
