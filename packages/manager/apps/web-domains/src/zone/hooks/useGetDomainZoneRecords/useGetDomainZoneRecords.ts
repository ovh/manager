import { getDomainZoneRecords } from '@/zone/datas/api';
import { DomainZoneRecordsResponse, PaginatedZoneRecords, ZoneRecord } from '@/zone/types/zoneRecords.types';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

type UseGetDomainZoneRecordsData = {
  records: ZoneRecord[];
  fieldsTypes: string[];
  paginatedZone: PaginatedZoneRecords;
};

export const useGetDomainZoneRecords = (serviceName: string) => {
  const [allPages, setAllPages] = useState(false);

  const query = useInfiniteQuery<
    DomainZoneRecordsResponse,
    Error,
    UseGetDomainZoneRecordsData,
    string[],
    number
  >({
    queryKey: ['get', 'domain', 'zone', 'records', serviceName],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getDomainZoneRecords(serviceName, pageParam as number, 15),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const paginatedZone = lastPage.paginatedZone;
      if (!paginatedZone) {
        return null;
      }
      
      const totalCount = paginatedZone.count;
      const pagination = paginatedZone.pagination;
      const currentRecordsCount = paginatedZone.records?.results?.length ?? 0;
      
      const allFetchedRecords = allPages.flatMap(
        (page) => page.paginatedZone?.records?.results ?? []
      );
      const totalFetched = allFetchedRecords.length;
      
      if (totalFetched >= totalCount) {
        return null;
      }
      
      if (pagination && pagination.length > 0) {
        const currentIndex = pagination.indexOf(lastPageParam as number);
        if (currentIndex >= 0 && currentIndex < pagination.length - 1) {
          return pagination[currentIndex + 1];
        }
      }
      
      if (currentRecordsCount > 0) {
        const nextOffset = (lastPageParam as number) + currentRecordsCount;
        if (nextOffset < totalCount) {
          return nextOffset;
        }
      }
      
      return null;
    },
    select: (data: InfiniteData<DomainZoneRecordsResponse, number>): UseGetDomainZoneRecordsData => {
      const firstPage = data.pages[0];
      const allRecords = data.pages.flatMap(
        (page) => page.paginatedZone?.records?.results ?? []
      );
      
      return {
        records: allRecords,
        fieldsTypes: firstPage?.fieldsTypes ?? [],
        paginatedZone: firstPage?.paginatedZone ?? {
          count: 0,
          pagination: [],
          records: { results: [] },
        },
      };
    },
  });

  const fetchAllPages = useCallback(() => {
    if (!allPages) {
      setAllPages(true);
    }
  }, [allPages]);

  const refetch = useCallback(() => {
    setAllPages(false);
    return query.refetch();
  }, [query.refetch]);

  useEffect(() => {
    if (allPages && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [allPages, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return {
    ...query,
    data: query.data,
    fetchAllPages,
    refetch,
  };
};
