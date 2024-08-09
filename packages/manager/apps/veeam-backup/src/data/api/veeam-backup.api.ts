import { fetchIcebergV2, apiClient } from '@ovh-ux/manager-core-api';
import { VeeamBackupWithIam } from '../vcd.type';

export type GetvmwareCloudDirectorBackupListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': any;
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getvmwareCloudDirectorBackupListQueryKey = [
  'get/vmwareCloudDirector/backup',
];

/**
 * List VMware Cloud Director Backup services
 */
export const getvmwareCloudDirectorBackupList = async (
  params: GetvmwareCloudDirectorBackupListParams,
): Promise<any> =>
  apiClient.v2.get('/vmwareCloudDirector/backup', { data: params });

export type GetvmwareCloudDirectorBackupBackupIdParams = {
  /** Backup ID */
  backupId?: any;
};

export const getvmwareCloudDirectorBackupBackupIdQueryKey = (
  params: GetvmwareCloudDirectorBackupBackupIdParams,
) => [`get/vmwareCloudDirector/backup/${params.backupId}`];

/**
 *  : Get VMware Cloud Director Backup service
 */
export const getvmwareCloudDirectorBackupBackupId = async (
  params: GetvmwareCloudDirectorBackupBackupIdParams,
): Promise<any> =>
  apiClient.v2.get(`/vmwareCloudDirector/backup/${params.backupId}`);

export const getListingIcebergV2 = async ({
  pageSize,
  cursor,
}: {
  pageSize: number;
  cursor?: string;
}) => {
  const { data, status, cursorNext } = await fetchIcebergV2<VeeamBackupWithIam>(
    {
      route: '/vmwareCloudDirector/backup',
      pageSize,
      cursor,
    },
  );
  if (status > 400) {
    throw new Error();
  }
  return { data, status, cursorNext };
};
