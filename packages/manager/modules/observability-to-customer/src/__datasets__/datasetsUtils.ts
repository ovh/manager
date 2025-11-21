const datasets = import.meta.glob('./**/*.json', { eager: true });

export const getDataset = <T = unknown>(
  datasetType: string,
  datasetName: string,
): T[] | T | undefined => {
  const key = `./${datasetType}/${datasetName}.json`;
  const datasetModule = datasets[key] as { default?: T[] | T } | undefined;

  if (!datasetModule) {
    return [] as unknown as T[] | undefined;
  }

  const data = datasetModule.default ?? (datasetModule as unknown as T[] | T);

  if (Array.isArray(data)) return data;

  return data;
};
