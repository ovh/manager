import { aapi, v6 } from '@ovh-ux/manager-core-api';
import { getApiPath, getApiPathWithoutServiceName } from '../utils/apiPath';
import { LicenseType } from './type';

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
export const getlicenseOfficeServiceQueryKey = (serviceName: string) => [
  'get',
  'license',
  'office',
  serviceName,
];

export const getOfficeLicenseDetails = async (serviceName: string) => {
  const { data } = await v6.get(`${getApiPath(serviceName)}`);
  return data;
};

export const getOfficePrepaidLicenseDetails = async (serviceName: string) => {
  const { data } = await v6.get(`${getApiPath(serviceName)}`);
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

// PUT
export const updateOfficeLicenseDetails = async (
  serviceName: string,
  licenseData: Partial<LicenseType>,
): Promise<LicenseType> => {
  const { data } = await v6.put(getApiPath(serviceName), licenseData);
  return data;
};

// DELETE
