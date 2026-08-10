import { useBytes, useParam } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getLocalDiskHourlyPrice } from '@/api/data/instance-catalog';
import { useInstanceCatalog } from '@/api/hooks/useInstanceCatalog';
import { TLocalStorageDisk, selectLocalStorageDisks } from '@/helpers/flavor-storage';

import { useMergedKubeFlavors } from './useFlavors';
import useRepricingInstancesAvailable from './useRepricingInstancesAvailable';

type TFlavorWithBlobs = ReturnType<typeof useMergedKubeFlavors>['mergedFlavors'][0];

export type TNodeLocalStoragePrice = {
  hour: number;
  month: number;
  hourText: string;
  monthText: string;
};

export type TNodeLocalStorage = {
  disks: TLocalStorageDisk[];
  label: string | null;
  price: TNodeLocalStoragePrice | null;
};

const useNodeLocalStorage = (
  flavor?: TFlavorWithBlobs | null,
  region?: string | null,
): TNodeLocalStorage => {
  const { projectId } = useParam('projectId');
  const hasRepricing = useRepricingInstancesAvailable();
  const { data: catalog } = useInstanceCatalog(projectId, hasRepricing);
  const { formatBytes } = useBytes();
  const { getTextPrice: getHourlyTextPrice } = useCatalogPrice(4, { exclVat: true });
  const { getTextPrice: getMonthlyTextPrice } = useCatalogPrice(2, { exclVat: true });

  const disks = selectLocalStorageDisks(
    flavor?.blobs?.technical?.storage?.disks,
    flavor?.blobs?.technical?.nvme?.disks,
  );

  const label = disks.length
    ? disks
        .map(
          (disk) =>
            `${disk.count > 1 ? `${disk.count}x ` : ''}${formatBytes(disk.capacityInBytes, 0)} ${
              disk.technology
            }`,
        )
        .join(' + ')
    : null;

  if (!disks.length) {
    return { disks, label, price: null };
  }

  const hour = getLocalDiskHourlyPrice(catalog, flavor?.name, region) ?? 0;
  const month = convertHourlyPriceToMonthly(hour);

  return {
    disks,
    label,
    price: {
      hour,
      month,
      hourText: getHourlyTextPrice(hour),
      monthText: getMonthlyTextPrice(month),
    },
  };
};

export default useNodeLocalStorage;
