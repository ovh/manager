import { ColumnSort } from '@ovhcloud/manager-components';
import {
  VCDOrganizationWithIam,
  VeeamBackupWithIam,
  getVeeamBackupDisplayName,
  getVeeamBackupVCDOrganizationDisplayName,
} from '@/data';

export const sortVeeamBackups = (
  organizations: VCDOrganizationWithIam[] = [],
) => (sorting: ColumnSort, list: VeeamBackupWithIam[] = []) => {
  const sortedList = [...list].sort((v1, v2) => {
    switch (sorting.id) {
      case 'name':
        return getVeeamBackupDisplayName(v1)?.localeCompare(
          getVeeamBackupDisplayName(v2),
        );
      case 'status':
        return v1.resourceStatus?.localeCompare(v2.resourceStatus);
      case 'ovhref':
        return v1.id?.localeCompare(v2.id);
      case 'vcdorg':
        return getVeeamBackupVCDOrganizationDisplayName(
          organizations,
          v1,
        )?.localeCompare(
          getVeeamBackupVCDOrganizationDisplayName(organizations, v2),
        );
      case 'region':
        return v1.currentState.region?.localeCompare(v2.currentState.region);
      case 'createdat':
        return v1.createdAt?.localeCompare(v2.createdAt);
      default:
        return 0;
    }
  });

  return sorting.desc ? sortedList.reverse() : sortedList;
};
