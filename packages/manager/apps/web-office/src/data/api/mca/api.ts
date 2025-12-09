import { v6 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '../utils/apiPath';
import { CreateAttestationBodyParamsType, CreateAttestationType } from './type';

export const postCreateAttestation = async (
  serviceName: string,
  params: CreateAttestationBodyParamsType,
) => {
  const { data } = await v6.post<CreateAttestationType>(
    `${getApiPath(serviceName)}createAttestation`,
    params,
  );
  return data;
};
