import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVcdOrganization } from '../api';
import { VCDOrganization } from '../vcd.type';

export const useOrganization = (organiationId: string) =>
  useQuery<ApiResponse<VCDOrganization>, ApiError>({
    queryKey: ['/vmwareCloudDirector/organization', organiationId],
    queryFn: () => getVcdOrganization(organiationId),
  });

export const getOrganizationIdFromBackupId = (backupId = '') =>
  backupId.split('-veeam-backup')[0];

export const getOrganizationDisplayName = (org: VCDOrganization) =>
  org?.currentState?.fullName || org?.currentState?.name;
