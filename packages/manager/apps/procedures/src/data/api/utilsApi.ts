import { v6 } from '@ovh-ux/manager-core-api';

export const getServerTime: () => Promise<number> = () => {
  return v6
    .get('/auth/time')
    .then(({ data }: { data: string }) => Number(data));
};
