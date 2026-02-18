export type ObservabilityServiceParams = {
  resourceName: string;
  signal?: AbortSignal;
};

export type EditObservabilityServicePayload = {
  resourceName: string;
  targetSpec: {
    displayName: string;
  };
  signal?: AbortSignal;
};
