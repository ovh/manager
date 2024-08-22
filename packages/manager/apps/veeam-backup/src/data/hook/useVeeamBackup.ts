import {
  ColumnSort,
  useResourcesIcebergV2,
} from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { VeeamBackupWithIam } from '../vcd.type';
import { getVmwareCloudDirectorBackup } from '../api';

export const veeamBackupListQueryKey = ['/vmwareCloudDirector/backup'];

export const useVeeamBackupList = ({
  pageSize,
  defaultSorting,
  sort,
}: {
  pageSize?: number;
  defaultSorting?: ColumnSort;
  sort?: (
    sorting: ColumnSort,
    data: VeeamBackupWithIam[],
  ) => VeeamBackupWithIam[];
}) =>
  useResourcesIcebergV2<VeeamBackupWithIam>({
    route: '/vmwareCloudDirector/backup',
    queryKey: veeamBackupListQueryKey,
    pageSize,
    defaultSorting,
    sort,
  });

export const veeamBackupQueryKey = (id: string) => [
  `/vmwareCloudDirector/backup/${id}`,
];

export const useVeeamBackup = (id: string) =>
  useQuery({
    queryKey: veeamBackupQueryKey(id),
    queryFn: () => getVmwareCloudDirectorBackup(id),
    retry: false,
  });

export const getVeeamBackupDisplayName = (backup?: VeeamBackupWithIam) =>
  backup?.iam?.displayName || backup?.id;
