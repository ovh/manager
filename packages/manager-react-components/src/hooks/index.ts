import { TRegion as Region } from './useProjectRegions';

export * from './pci-project-provider';
export * from './useCatalogPrice';
export * from './useMe';
export * from './useProjectRegions';
export * from './useProjectUrl';
export * from './feature-availability';
export * from './datagrid/useIcebergV2';
export * from './datagrid/useIcebergV6';
export * from './datagrid/useResourcesV6';
export * from './services';
export * from './tasks';
export { useProductMaintenance } from './pci/useMaintenance';
export {
  getMacroRegion,
  useTranslatedMicroRegions,
} from './region/useTranslatedMicroRegions';
export * from './region/continent';

export type TRegion = Region;
