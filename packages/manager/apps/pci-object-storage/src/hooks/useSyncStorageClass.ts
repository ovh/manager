import { useEffect } from 'react';
import { ObjectContainerMode, ReplicationStorageClass } from '@/constants';
import { TReplicationDestination } from '@/pages/objects/container/object/add-replication/ReplicationRuleDestination.component';
import { TRegion } from '@/api/data/region';
import { TReplicationRule } from '@/api/hooks/useStorages';

export type TUseSyncStorageClass = {
  isEditMode: boolean;
  existingRule: TReplicationRule;
  destinationRegion: TRegion;
  destination: TReplicationDestination;
  setUseStorageclass: (useStorageclass: boolean) => void;
  setStorageClass: (value: ReplicationStorageClass) => void;
};

export const useSyncStorageClass = ({
  isEditMode,
  existingRule,
  destinationRegion,
  destination,
  setUseStorageclass,
  setStorageClass,
}: TUseSyncStorageClass) => {
  useEffect(() => {
    if (isEditMode && existingRule) {
      setUseStorageclass(!!existingRule.destination?.storageClass);

      if (
        destinationRegion?.type === ObjectContainerMode.MULTI_ZONES &&
        existingRule.destination?.storageClass ===
          ReplicationStorageClass.HIGH_PERF
      ) {
        setStorageClass(ReplicationStorageClass.STANDARD);
      } else {
        setStorageClass(
          existingRule.destination?.storageClass ||
            ReplicationStorageClass.STANDARD,
        );
      }
    }
  }, [destinationRegion, destination, isEditMode, existingRule]);
};
