import { useMemo } from 'react';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { TServerContainer } from '@/api/data/container';
import { TRegion } from '@/api/data/region';
import { TStorage } from '@/api/data/storages';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';

export const useMergedContainer = (
  serverContainer: TServerContainer | null,
  targetContainer: TStorage,
  url: string,
  region: TRegion,
) => {
  const { formatBytes } = useBytes();

  return useMemo((): TContainer | null => {
    if (!serverContainer) return null;
    const s3StorageType = targetContainer?.s3StorageType;

    return {
      ...serverContainer,
      id: serverContainer?.id || targetContainer?.id,
      name: serverContainer?.name || targetContainer?.name,
      objectsCount:
        serverContainer?.storedObjects || serverContainer?.objectsCount,
      usedSpace: formatBytes(
        serverContainer?.storedBytes || serverContainer?.objectsSize,
        2,
        1024,
      ),
      publicUrl: url,
      s3StorageType,
      regionDetails: s3StorageType ? region : undefined,
      staticUrl: serverContainer?.staticUrl || serverContainer?.virtualHost,
    };
  }, [serverContainer, region, targetContainer, url, formatBytes]);
};
