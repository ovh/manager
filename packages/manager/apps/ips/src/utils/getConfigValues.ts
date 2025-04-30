import { ProductConfiguration } from './getCatalog';

export const getConfigValues = (
  configs: ProductConfiguration[] = [],
  configName: string,
) => {
  return configs.find((config) => config.name === configName)?.values || [];
};
