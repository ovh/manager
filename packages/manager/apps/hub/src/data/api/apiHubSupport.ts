import { aapi } from '@ovh-ux/manager-core-api';
import { SupportDataResponse } from '@/types/support.type';

export const getHubSupport: () => Promise<SupportDataResponse> = async () =>
  aapi.get('/hub/support').then(({ data }) => data.data.support.data);
