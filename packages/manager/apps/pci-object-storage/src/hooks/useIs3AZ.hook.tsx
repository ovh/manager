import {
  Region,
  RegionTypeEnum,
  StorageContainer,
} from '@datatr-ux/ovhcloud-types/cloud';

const useIs3AZ = (s3: StorageContainer, regions: Region[]) => {
  if (!regions) return true;
  return (
    regions.find((reg) => reg.name === s3.region).type ===
    RegionTypeEnum['region-3-az']
  );
};

export { useIs3AZ };
