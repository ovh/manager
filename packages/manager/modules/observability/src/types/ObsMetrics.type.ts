export type ObsMetrics = {
  id: string;
  region: string;
  iam: IAM;
};

export type IAM = {
  displayName: string;
  id: string;
  urn: string;
};

export type ObsMetricsOptions = {
  optionTest?: string;
};
