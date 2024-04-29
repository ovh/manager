import { apiClient } from '@ovh-ux/manager-core-api';

type Response = unknown;

export type GetZimbraPlatformParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Add extra information about resources in output */
  details: boolean;
  /** Filter on the readOnly attribute */
  readOnly: boolean;
};

export const getZimbraPlatformQueryKey = ['get//zimbra/platform'];

/**
 *  : Retrieve platform
 */
export const getZimbraPlatform = async (
  params: GetZimbraPlatformParams,
): Promise<Response[]> =>
  apiClient.v2.get('/zimbra/platform', { data: params });
