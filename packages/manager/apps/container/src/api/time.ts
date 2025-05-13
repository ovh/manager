import { v6 } from '@ovh-ux/manager-core-api';

export const fetchTime = async (): Promise<number> => {
  const { data } = await v6.get<number>('/auth/time');
  return data;
};
