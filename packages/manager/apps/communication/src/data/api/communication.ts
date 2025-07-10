import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export const getMeNotificationEmailHistoryListQueryKey = [
  'get/me/notification/email/history',
];

/**
 * Email history : Retrieve every email sent to you
 */
export const getMeNotificationEmailHistoryList = async (): Promise<any> =>
  apiClient.v6.get('/me/notification/email/history');

export type GetmeNotificationEmailHistoryIdParams = {
  /** Id */
  id?: any;
};

export const getMeNotificationEmailHistoryIdQueryKey = (
  params: GetmeNotificationEmailHistoryIdParams,
) => [`get/me/notification/email/history/${params.id}`];

/**
 * Email history : Retrieve information about an email
 */
export const getMeNotificationEmailHistoryId = async (
  params: GetmeNotificationEmailHistoryIdParams,
): Promise<any> =>
  apiClient.v6.get(`/me/notification/email/history/${params.id}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({
  pageSize,
  page,
}: {
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/me/notification/email/history`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
