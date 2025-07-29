import { Application } from '@ovh-ux/manager-config';
import { aapi } from '@ovh-ux/manager-core-api';

export const getApplications = async (): Promise<Record<
  string,
  Application
>> => {
  const { data } = await aapi.get<Record<string, Application>>('/applications');
  return data;
};
