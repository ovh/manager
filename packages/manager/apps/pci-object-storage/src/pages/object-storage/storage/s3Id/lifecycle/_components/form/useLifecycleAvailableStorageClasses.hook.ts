import storages from '@/types/Storages';
import { useAvailableStorageClasses } from '@/hooks/useAvailableStorageClasses.hook';

export function useLifecycleAvailableStorageClasses(region: string) {
  const { availableStorageClasses, isPending } = useAvailableStorageClasses(
    region,
  );

  return {
    availableStorageClasses: availableStorageClasses.filter(
      (sc) => sc !== storages.StorageClassEnum.HIGH_PERF,
    ),
    isPending,
  };
}
