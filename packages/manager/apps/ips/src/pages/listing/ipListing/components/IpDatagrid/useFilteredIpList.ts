/* eslint-disable max-lines-per-function */
import {
  useByoipSliceList,
  useGetIpList,
  useIcebergGetIpReverseList,
} from '@/data/hooks';
import { ListingContext } from '@/pages/listing/listingContext';
import { getIpv4SubIpList, isValidIpv6Block } from '@/utils';
import { useContext, useMemo } from 'react';

export function useFilteredIpList(
  numberOfPageDisplayed: number,
  pageSize: number,
) {
  const {
    apiFilter,
    onGoingAggregatedIps,
    onGoingSlicedIps,
    onGoingCreatedIps,
  } = useContext(ListingContext);

  const { ipList, isLoading, error, isError } = useGetIpList(apiFilter);

  const filteredIpList = useMemo(() => {
    if (!ipList) return [];

    const ipListWithOngoingOperations = [
      ...ipList,
      ...onGoingAggregatedIps,
      ...onGoingSlicedIps,
      ...onGoingCreatedIps,
    ];

    // remove duplicates
    const ipSet = new Set(ipListWithOngoingOperations);
    const uniqueIpList = Array.from(ipSet);

    // filter by apiFilter.ip if exists
    return apiFilter?.ip
      ? uniqueIpList.filter((ip) => ip.includes(apiFilter.ip))
      : uniqueIpList;
  }, [
    ipList.toString(),
    onGoingAggregatedIps.toString(),
    onGoingSlicedIps.toString(),
    onGoingCreatedIps.toString(),
    JSON.stringify(apiFilter),
  ]);

  const paginatedIpList = useMemo(() => {
    return filteredIpList
      .map((ip) => ({ ip }))
      .slice(0, pageSize * numberOfPageDisplayed)
      .map(({ ip }) => ip);
  }, [filteredIpList.toString(), numberOfPageDisplayed, pageSize]);

  const {
    isError: isReverseIpListError,
    isLoading: isReverseIpListLoading,
    reverseListByIp,
  } = useIcebergGetIpReverseList({
    ipList: paginatedIpList,
  });

  const {
    isError: isSliceListError,
    isLoading: isSliceListLoading,
    sliceListByIp,
  } = useByoipSliceList({
    ipList: paginatedIpList,
  });

  const datagridIpList = useMemo(() => {
    return paginatedIpList.map((ip) => {
      const reverseList = reverseListByIp?.[ip] || [];
      const sliceList = sliceListByIp?.[ip] || [];

      if (sliceList.length > 0) {
        const sliceWith32 = sliceList.find(
          ({ slicingSize }) => slicingSize === 32,
        );
        if (sliceWith32) {
          return {
            ip,
            subRows: sliceWith32.childrenIps.map((childIp) => ({
              parentIpGroup: ip,
              ip: childIp.replace('/32', ''),
              isByoipSlice: true,
            })),
          };
        }
      }

      return isValidIpv6Block(ip)
        ? {
            ip,
            subRows:
              reverseList.length > 0
                ? reverseList.map(({ ipReverse }) => ({
                    ip: ipReverse,
                    parentIpGroup: ip,
                    isByoipSlice: false,
                  }))
                : [{ parentIpGroup: ip, ip: '', isByoipSlice: false }],
          }
        : {
            ip,
            subRows: getIpv4SubIpList(ip).map((subIp) => ({
              ip: subIp,
              parentIpGroup: ip,
              isByoipSlice: false,
            })),
          };
    });
  }, [
    paginatedIpList.toString(),
    JSON.stringify(reverseListByIp),
    JSON.stringify(sliceListByIp),
  ]);

  return {
    datagridIpList,
    totalCount: filteredIpList.length,
    isLoading: isLoading || isReverseIpListLoading || isSliceListLoading,
    isError: isError || isReverseIpListError || isSliceListError,
    error,
  };
}
