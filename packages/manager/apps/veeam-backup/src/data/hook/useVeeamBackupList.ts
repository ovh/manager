import {
  ColumnSort,
  useResourcesIcebergV2,
} from '@ovhcloud/manager-components';
import { VeeamBackupWithIam } from '../vcd.type';

export const veeamBackupListQueryKey = ['/vmwareCloudDirector/backup'];

export const useVeeamBackupList = ({
  pageSize,
  defaultSorting,
  sort,
}: {
  pageSize?: number;
  defaultSorting: ColumnSort;
  sort: (
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

export const getVeeamBackupDisplayName = (backup?: VeeamBackupWithIam) =>
  backup?.iam?.displayName || backup?.id;
