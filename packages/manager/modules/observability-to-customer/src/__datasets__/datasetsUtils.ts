const datasets = import.meta.glob('./**/*.json', { eager: true });

export const getDataset = <T = unknown>(datasetType: string, datasetName: string): T[] => {
  const key = `./${datasetType}/${datasetName}.json`;
  const datasetModule = datasets[key] as { default?: T[] } | undefined;

  if (!datasetModule) return [];

  return datasetModule.default ?? (datasetModule as unknown as T[]);
};
