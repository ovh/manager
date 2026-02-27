import { useQuery } from '@tanstack/react-query';

import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';

import { getIcebergIpList } from '@/data/api';
import { IpVersion, ServiceType } from '@/types';
import { IpObject } from '@/types/ipObject';

import { useAdditionalIpsRegions } from './catalog/useAdditionalIpsRegions';

/**
 * Return the list of unavailable region to order an additional IPs for a given service
 */
export const getUnavailableRegionList = (
  additionalIps: IpObject[] = [],
  serviceName?: string | null,
) => {
  const serviceListByRegion =
    additionalIps
      ?.filter((ip) => ip.isAdditionalIp && ip.version === 6)
      .flatMap((ip) =>
        ip.regions.map((region) => ({
          region,
          service: ip.routedTo.serviceName,
        })),
      )
      .reduce(
        (result, { region, service }) => ({
          ...result,
          [region]: result[region] ? result[region].concat(service) : [service],
        }),
        {} as { [region: string]: (string | null)[] },
      ) || {};

  return Object.entries(serviceListByRegion)
    .map(([region, serviceList]) => ({
      region,
      has3blocks: serviceList.length >= 3,
      alreadyInCurrentVrack: !serviceName || serviceList.includes(serviceName),
    }))
    .filter(
      ({ has3blocks, alreadyInCurrentVrack }) =>
        has3blocks || alreadyInCurrentVrack,
    );
};

export const useIpv6Availability = ({
  ipVersion,
  serviceName,
  serviceType,
}: {
  serviceName?: string | null;
  serviceType?: ServiceType;
  ipVersion?: IpVersion;
}) => {
  const {
    regionList,
    isLoading: isRegionListLoading,
    isError: isRegionListError,
    error: regionListError,
  } = useAdditionalIpsRegions({ ipVersion, serviceType });
  const { data, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpObject>,
    ApiError
  >({
    queryKey: ['additionalips', 'ipv6'],
    queryFn: () =>
      getIcebergIpList({
        isAdditionalIp: true,
        version: 6,
      }),
    enabled: ipVersion === IpVersion.ipv6,
  });

  return {
    hasReachedIpv6Limit:
      data?.data && data?.data?.length >= regionList?.length * 3,
    disabledRegionList: getUnavailableRegionList(data?.data, serviceName),
    loading: isLoading || isRegionListLoading,
    isError: isError || isRegionListError,
    error: error || regionListError,
  };
};
