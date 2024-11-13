import {
  useQuery,
  useQueries,
  UseQueryOptions,
  keepPreviousData,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { getVcdOrganization, getVmwareCloudDirectorBackup } from '../api';
import { getRegionNameFromAzName } from './useVeeamBackup';
import {
  BackupStatus,
  VCDOrganization,
  VCDOrganizationWithBackupStatus,
  VeeamBackup,
} from '../types';
import { VCD_ORGANIZATION_ROUTE } from '../utils/apiRoutes';
import {
  getVcdOrganizationBackupQueryKey,
  getVcdOrganizationQueryKey,
} from '../utils';

type UseVcdOrganization = Pick<UseQueryOptions, 'refetchInterval'> & {
  id: string;
};

const backupSuffix = '-veeam-backup';

export const getOrganizationUuid = (organization?: VCDOrganization) =>
  organization?.id.split(
    `${organization?.currentState.region.toLowerCase()}-`,
  )[1];

export const getAvailabilityZone = (organization?: VCDOrganization) =>
  `${organization?.currentState?.region.toLowerCase()}-a`;

export const getOrganizationIdFromBackup = (backup?: VeeamBackup) =>
  `org-${getRegionNameFromAzName(backup?.currentState?.azName)}-${
    backup?.id.split(backupSuffix)[0]
  }`;

export const getOrganizationDisplayName = (organization?: VCDOrganization) =>
  organization?.currentState?.fullName || organization?.currentState?.name;

export const getBackupIdFromOrganization = (organization: VCDOrganization) =>
  `${getOrganizationUuid(organization)}${backupSuffix}`;

export const organizationListQueryKey = [VCD_ORGANIZATION_ROUTE];

export const useOrganizationList = ({ pageSize }: { pageSize?: number }) =>
  useResourcesIcebergV2<VCDOrganization>({
    route: VCD_ORGANIZATION_ROUTE,
    queryKey: organizationListQueryKey,
    pageSize,
  });

export const useOrganizationWithBackupStatusList = ({
  pageSize,
}: {
  pageSize?: number;
}) => {
  const { flattenData, isLoading, ...result } = useOrganizationList({
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
              getBackupIdFromOrganization(org),
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
    queryKey: [VCD_ORGANIZATION_ROUTE, organizationId],
    queryFn: () => getVcdOrganization(organizationId),
  });

export const useVcdOrganization = ({
  id,
  refetchInterval,
}: UseVcdOrganization) => {
  return useQuery<ApiResponse<VCDOrganization>, ApiError>({
    queryKey: getVcdOrganizationQueryKey(id),
    queryFn: () => getVcdOrganization(id),
    retry: false,
    refetchInterval,
    placeholderData: keepPreviousData,
  });
};

export const useVcdOrganizationBackup = (vcdOrganization: VCDOrganization) => {
  return useQuery<ApiResponse<VeeamBackup>, ApiError>({
    queryKey: getVcdOrganizationBackupQueryKey(vcdOrganization.id),
    queryFn: () =>
      getVmwareCloudDirectorBackup(
        getBackupIdFromOrganization(vcdOrganization),
      ),
    retry: false,
    placeholderData: keepPreviousData,
  });
};
