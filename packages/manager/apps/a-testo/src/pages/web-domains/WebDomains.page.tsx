import { useEffect } from 'react';
import { useEventSource, BaseLayout, Breadcrumb, useDataApi, Datagrid, useUrlParams } from '@ovh-ux/muk';
import { FilterCategories } from '@ovh-ux/manager-core-api';

// URL to test search params
// http://localhost:9000/#/a-testo/a-testo/web-domains?mainState=OK&mainState=RESTORABLE
// https://manager.eu.ovhcloud.com/#/web-domains/domain?mainState=OK&mainState=RESTORABLE
// https://github.com/ovh/manager/blob/master/packages/manager/apps/web-domains/src/domain/hooks/useDomainDataApiWithRouteParams.tsx

const WebDomainsPage = () => {
    const urlParamKeys = ['mainState', 'suspensionState', 'searchValue'] as const;
    const { params, setQueryParams, queryString, deleteQueryParam } = useUrlParams(urlParamKeys);
    const deleteParams = (key: string) => {
      deleteQueryParam(key as (typeof urlParamKeys)[number]);
    };

    // Event source to listen to events
    const { eventSource } = useEventSource();

    useEffect(() => {
      if (!eventSource) {
        return undefined;
      }

      const handleMessage = (event: MessageEvent) => {
        console.info('Event source message :', event.data);
      };

      const handleError = (event: Event) => {
        console.info('Event source error :', event);
      };

      const handleOpen = () => {
        console.info('Event source open :');
      };

      eventSource.onmessage = handleMessage;
      eventSource.onerror = handleError;
      eventSource.onopen = handleOpen;

      return () => {
        eventSource.onmessage = null;
        eventSource.onerror = null;
        eventSource.onopen = null;
      };
    }, [eventSource]);

    console.info('WebDomainsPage urlParamKeys :', urlParamKeys);
    console.info('WebDomainsPage params :', params);
    const columns = [
      {
          id: 'id',
          label: 'ID',
          accessorKey: 'id',
          cell: ({ getValue }: any) => <div>{getValue()}</div>,
      },
      {
          id: 'mainState',
          label: 'mainState',
          header: 'status',
          accessorKey: 'currentState.mainState',
          isFilterable: true,
          cell: ({ getValue }: any) => <div>{getValue()}</div>,
          comparator: FilterCategories.Options,
          filterOptions: [
            { label: 'OK', value: 'OK' },
            { label: 'RESTORABLE', value: 'RESTORABLE' },
          ],
      }
    ,
      {
          id: 'suspensionState',
          label: 'suspensionState',
          header: 'suspensionState',
          accessorKey: 'currentState.suspensionState',
          isFilterable: true,
          isSearchable: true,
          cell: ({ getValue }: any) => <div>{getValue()}</div>,
          comparator: FilterCategories.Options,
          filterOptions: [
            { label: 'NOT_SUSPENDED', value: 'NOT_SUSPENDED' },
            { label: 'SUSPENDED', value: 'SUSPENDED' },
          ],
        }
    ];

    const { search, flattenData, isLoading, isSuccess, isError, filters, hasNextPage, fetchNextPage } = useDataApi({
    columns: columns,
    route: queryString ? `/domain/name?${queryString}` : '/domain/name',

    version: 'v2',
    cacheKey: ['domain-name', queryString ? queryString : ''],
    iceberg: false,
    enabled: true,
    urlParams: {
      params: params,
      setParams: setQueryParams,
      deleteParams,
      paramsToString: () => queryString,
      searchParams: 'searchValue',
    },
    });

    return (
        <BaseLayout
          header={{
              title: 'Web Domains',
          }}
          breadcrumb={<Breadcrumb appName="a-testo-2" rootLabel="a-testo-3" />}
        >
        { isSuccess && (
            <Datagrid
              isLoading={isLoading}
              columns={columns}
              data={isError ? [] : flattenData}
              filters={filters}
              hasNextPage={hasNextPage}
              onFetchNextPage={fetchNextPage}
              search={search}
            />
        )}
        </BaseLayout>
    );
};

export default WebDomainsPage;
