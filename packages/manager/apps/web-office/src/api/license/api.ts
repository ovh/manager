import { aapi, v6 } from '@ovh-ux/manager-core-api';
import { getApiPath, getApiPathWithoutServiceName } from '../utils/apiPath';
import { UserParamsType } from '../api.type';

// GET

export const getOfficeGlobalLicenses = async () => {
  const { data } = await aapi.get('service', {
    params: {
      external: false,
      type: '/license/office',
    },
  });
  return data;
};

export const getOfficeLicenseDetails = async (serviceName: string) => {
  const { data } = await v6.get(getApiPath(serviceName));
  return data;
};

export const getOfficePrepaidLicenseDetails = async (serviceName: string) => {
  const { data } = await v6.get(getApiPath(serviceName));
  return data;
};

export const getOfficeLicenses = async (serviceName: string) => {
  const { data } = await v6.get<string[]>(
    getApiPathWithoutServiceName(serviceName),
  );
  return data;
};

export const getOfficePrepaidLicenses = async (serviceName: string) => {
  const { data } = await v6.get<string[]>(
    getApiPathWithoutServiceName(serviceName),
  );
  return data;
};

// POST

export const postOfficePrepaidLicenseUnconfigure = async (
  serviceName: string,
  activationEmail: string,
) => {
  const { data } = await v6.post(
    `${getApiPathWithoutServiceName(
      serviceName,
    )}${activationEmail}/unconfigure`,
  );
  return data;
};

// PUT

export const putOfficeLicenseDetails = async (
  serviceName: string,
  params: UserParamsType,
) => {
  const { data } = await v6.put(getApiPath(serviceName), params);
  return data;
};

// DELETE
