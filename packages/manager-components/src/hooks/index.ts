import { TRegion as Region } from './useProjectRegions';

export * from './pci-project-provider';
export * from './useCatalogPrice';
export * from './useMe';
export * from './useProjectRegions';
export * from './useProjectUrl';
export * from './feature-availability';
export { useProductMaintenance } from './pci/useMaintenance';
export {
  getMacroRegion,
  useTranslatedMicroRegions,
} from './region/useTranslatedMicroRegions';

export type TRegion = Region;
