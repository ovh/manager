import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ErrorResponse, isRouteErrorResponse } from 'react-router-dom';
import { AxiosError, isAxiosError } from 'axios';
import { HOUR_AVERAGE_IN_MONTH } from '@/constants';

type RouterErrorResponse = Pick<
  ErrorResponse,
  'data' | 'status' | 'statusText'
> & {
  internal: boolean;
};

export const isApiErrorResponse = (error: unknown): error is ApiError =>
  isAxiosError(error) &&
  (error as AxiosError<{ message: string }>).response?.data.message !==
    undefined;

export const mapUnknownErrorToBannerError = (
  error: unknown,
): ErrorBannerProps['error'] => {
  if (isApiErrorResponse(error) && error.response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { statusText, config, request, ...rest } = error.response;
    return rest;
  }
  if (isRouteErrorResponse(error)) {
    const {
      statusText,
      internal,
      ...rest
    } = (error as unknown) as RouterErrorResponse;
    return rest;
  }
  return {};
};

export const instancesQueryKey = (
  projectId: string,
  rest?: string[],
): string[] => [
  'project',
  projectId,
  'instances',
  ...(rest && rest.length > 0 ? rest : []),
];

export const replaceToSnakeCase = (str: string): string =>
  str.replace(/[-/]/g, '_');

export const isCustomUrlSection = (str: string): boolean =>
  str.includes('-') || str.includes('/');

export const groupBy = <T, K>(array: T[], getValue: (item: T) => K) => {
  return array.reduce((acc, item) => {
    const value = getValue(item);
    acc.set(value, (acc.get(value) || []).concat(item));
    return acc;
  }, new Map<K, T[]>());
};

export const getLocalZoneTranslationKey = (regionName: string) =>
  regionName.split('-').slice(-1)[0];

export const isEven = (nb: number) => nb % 2 === 0;

export const getRegionalizedFlavorId = (itemName: string, regionName: string) =>
  `${itemName}_${regionName}`;

export const getRegionalizedFlavorOsTypeId = (
  flavorName: string,
  regionName: string,
  osType: string,
) => `${getRegionalizedFlavorId(flavorName, regionName)}_${osType}`;

export const getRegionalizedFlavorOsTypePriceId = (
  flavorName: string,
  regionName: string,
  osType: string,
) => `${getRegionalizedFlavorOsTypeId(flavorName, regionName, osType)}_price`;

export const getRegionalizedImageId = (
  imageVersionName: string,
  regionName: string,
) => `${imageVersionName}_${regionName}`;

export const convertHourlyPriceToMonthly = (hourlyPrice: number): number =>
  hourlyPrice * HOUR_AVERAGE_IN_MONTH;
export const getRegionalizedGatewayId = (size: string, regionName: string) =>
  `gateway_${size}_${regionName}`;

export const getRegionalizedPublicIpId = (type: string, regionName: string) =>
  `${type}_${regionName}`;

const MBIT_PER_GBIT = 1000;

export type TBandwidthDisplay = {
  value: number;
  unit: 'mbit_s' | 'gbit_s';
};

export const formatBandwidthDisplay = (
  value: number,
  unit: string,
): TBandwidthDisplay => {
  const isMbit = /Mbit/i.test(unit);
  if (isMbit && value >= MBIT_PER_GBIT) {
    const gbit = value / MBIT_PER_GBIT;
    return {
      value: Number.isInteger(gbit) ? gbit : Number(gbit.toFixed(1)),
      unit: 'gbit_s',
    };
  }
  return { value, unit: 'mbit_s' };
};
