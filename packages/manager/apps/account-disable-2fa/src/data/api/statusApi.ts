import { v6 } from '@ovh-ux/manager-core-api';
import { Status2fa } from '@/types/status.type';

export const get2faStatus: () => Promise<Status2fa> = () => {
  return v6.get('/me/procedure/2FA').then(({ data }) => data);
};
