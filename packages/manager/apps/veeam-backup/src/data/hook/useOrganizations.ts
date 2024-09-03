import { useQuery, useQueries } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useResourcesIcebergV2 } from '@ovhcloud/manager-components';
import { getVcdOrganization, getVmwareCloudDirectorBackup } from '../api';
import {
  BackupStatus,
  VCDOrganization,
  VCDOrganizationWithBackupStatus,
} from '../vcd.type';

export const getOrganizationIdFromBackupId = (backupId = '') =>
  backupId.split('-veeam-backup')[0];

export const getOrganizationDisplayName = (organization?: VCDOrganization) =>
  organization?.currentState?.fullName || organization?.currentState?.name;

export const getBackupIdFromOrganizationId = (organizationId: string) =>
  `${organizationId}-veeam-backup`;

export const organizationListQueryKey = ['/vmwareCloudDirector/organization'];

export const useOrganizationList = ({ pageSize }: { pageSize?: number }) => {
  const { flattenData, isLoading, ...result } = useResourcesIcebergV2<
    VCDOrganization
  >({
    route: '/vmwareCloudDirector/organization',
    queryKey: organizationListQueryKey,
    pageSize,
  });

  const backups = useQueries({
    queries:
      flattenData?.map((org) => ({
        queryKey: ['org-backup', org.id],
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!org.id,
        queryFn: async () => {
          try {
            await getVmwareCloudDirectorBackup(
              getBackupIdFromOrganizationId(org.id),
            );
            return { organization: org.id, backupStatus: BackupStatus.active };
          } catch (err) {
            return {
              organization: org.id,
              backupStatus:
                (err as ApiError).response.status === 404
                  ? BackupStatus.none
                  : BackupStatus.error,
            };
          }
        },
      })) || [],
  });

  return {
    ...result,
    isLoading: isLoading || backups.some((query) => query.isLoading),
    flattenData: flattenData?.map((org) => ({
      ...org,
      backupStatus: backups?.find((b) => b.data?.organization === org.id)?.data
        ?.backupStatus,
    })) as VCDOrganizationWithBackupStatus[],
  };
};

export const useOrganization = (organizationId: string) =>
  useQuery<ApiResponse<VCDOrganization>, ApiError>({
    queryKey: ['/vmwareCloudDirector/organization', organizationId],
    queryFn: () => getVcdOrganization(organizationId),
  });
