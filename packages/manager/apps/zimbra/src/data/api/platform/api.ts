import { v2 } from '@ovh-ux/manager-core-api';

import { ZimbraPlatformType } from './type';

export const getZimbraPlatformList = async () => {
  const { data } = await v2.get<ZimbraPlatformType[]>('/zimbra/platform');
  return data;
};
