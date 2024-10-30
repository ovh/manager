import IVcdOrganization from '@/types/vcd-organization.interface';

const getOrganizationUuid = (organization: IVcdOrganization) =>
  organization.id.split(
    `${organization.currentState.region.toLowerCase()}-`,
  )[1];

export const getBackupIdFromOrganization = (organization: IVcdOrganization) =>
  `${getOrganizationUuid(organization)}-veeam-backup`;
