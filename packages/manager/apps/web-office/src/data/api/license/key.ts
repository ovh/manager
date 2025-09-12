import { getApiPath } from '../utils/apiPath';

export const getOfficeLicenseDetailsQueryKey = (serviceName: string) => [
  'get',
  getApiPath(serviceName),
  serviceName,
];

export const getOfficeLicenseQueryKey = (serviceName: string) => ['get', getApiPath(serviceName)];
