import { User } from '@ovh-ux/manager-config';
import { v6 } from '@ovh-ux/manager-core-api';

export type Me = User & {
  businessVerificationRequired?: boolean;
};

export const getMe = async (): Promise<Me> => {
  const { data } = await v6.get<Me>('/me');
  return data;
};
