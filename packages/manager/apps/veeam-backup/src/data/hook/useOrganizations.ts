import { useResourcesIcebergV2 } from '@ovhcloud/manager-components';
import { VCDOrganizationWithIam, VeeamBackupWithIam } from '../vcd.type';

export const useOrganizations = () =>
  useResourcesIcebergV2<VCDOrganizationWithIam>({
    route: '/vmwareCloudDirector/organization',
    queryKey: ['/vmwareCloudDirector/organization'],
  });

export const getOrganizationDisplayName = (org: VCDOrganizationWithIam) =>
  org?.currentState?.fullName || org?.currentState?.name;

export const getVeeamBackupVCDOrganization = (
  organizations: VCDOrganizationWithIam[],
  backup: VeeamBackupWithIam,
) => organizations?.find((o) => backup.id.includes(o.id));

export const getVeeamBackupVCDOrganizationDisplayName = (
  organizations: VCDOrganizationWithIam[],
  backup: VeeamBackupWithIam,
) =>
  getOrganizationDisplayName(
    getVeeamBackupVCDOrganization(organizations, backup),
  );
