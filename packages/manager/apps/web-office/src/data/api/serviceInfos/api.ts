import { v6 } from '@ovh-ux/manager-core-api';
import { getApiPath } from '../utils/apiPath';

export const getOfficeLicenseServiceInfos = async (serviceName: string) => {
  const { data } = await v6.get(`${getApiPath(serviceName)}serviceInfos`);
  return data;
};
