import { v6 } from '@ovh-ux/manager-core-api';

export const getCreditBalance = async (): Promise<string[]> => {
  const { data } = await v6.get('/me/credit/balance');
  return data;
};

export const getStartupProgram = async () => {
  const { data } = await v6.get('/me/credit/balance/STARTUP_PROGRAM');
  return data;
};
