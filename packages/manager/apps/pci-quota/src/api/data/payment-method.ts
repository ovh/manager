import { v6 } from '@ovh-ux/manager-core-api';

export const getValidPaymenthMethodids = async () => {
  const { data } = await v6.get<string[]>('/me/payment/method?status=VALID');
  return data;
};
