import { v6 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '../utils/apiPath';
import { CreateAttestationBodyParamsType, CreateAttestationType } from './type';

export const postCreateAttestation = async (
  serviceName: string,
  params: CreateAttestationBodyParamsType,
) => {
  const { data } = await v6.post<CreateAttestationType>(
    `${getApiPath(serviceName)}parentTenant/createAttestation`,
    params,
  );
  return data;
};

export const postAcceptAgreement = async (serviceName: string) => {
  const { data } = await v6.post<unknown>(`${getApiPath(serviceName)}parentTenant/acceptAgreement`);
  return data;
};
