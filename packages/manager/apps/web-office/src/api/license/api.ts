import { v6 } from '@ovh-ux/manager-core-api';
import { GetOfficeLicenseServiceParams } from './type';
import { getApiPath } from '../utils/apiPath';

// GET

export const getlicenseOfficeServiceQueryKey = (
  params: GetOfficeLicenseServiceParams,
) => [`get/license/office/${params.serviceName}`];

export const getOfficeLicenseDetails = async (serviceName: string) => {
  const { data } = await v6.get(`${getApiPath(serviceName)}`);
  return data;
};

// POST

// PUT

// DELETE
