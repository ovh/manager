import {
  Region,
  RegionTypeEnum,
  StorageContainer,
} from '@datatr-ux/ovhcloud-types/cloud';

export function useIsLocaleZone(s3: StorageContainer, regions: Region[]) {
  if (!regions) return true;
  return (
    regions.find((reg) => reg.name === s3.region).type ===
    RegionTypeEnum.localzone
  );
}
