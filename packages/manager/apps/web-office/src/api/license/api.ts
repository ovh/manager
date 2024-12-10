import { v6 } from '@ovh-ux/manager-core-api';
import { GetOfficeLicenseServiceParams } from './type';
import { getApiPath, getApiPathWithoutServiceName } from '../utils/apiPath';

// GET

export const getlicenseOfficeServiceQueryKey = (
  params: GetOfficeLicenseServiceParams,
) => [`get/license/office/${params.serviceName}`];

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

// DELETE
