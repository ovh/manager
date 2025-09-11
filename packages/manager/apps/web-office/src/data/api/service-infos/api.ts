import { v6 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '../utils/apiPath';
import { OfficeLicenseServiceInfosType } from './type';

export const getOfficeLicenseServiceInfos = async (serviceName: string) => {
  const { data } = await v6.get<OfficeLicenseServiceInfosType>(
    `${getApiPath(serviceName)}serviceInfos`,
  );
  return data;
};
