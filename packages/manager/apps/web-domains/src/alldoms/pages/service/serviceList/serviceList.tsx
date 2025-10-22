import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';

import { toASCII } from 'punycode';
import { useAllDomDatagridColumns } from '@/alldoms/hooks/allDomDatagrid/useAllDomDatagridColumns';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { AlldomService } from '@/alldoms/types';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';
import { findContact } from '@/alldoms/utils/utils';

export default function ServiceList() {
  const { t } = useTranslation(['allDom']);
  const { notifications } = useNotifications();
  const [searchInput, setSearchInput] = useState('');
  const [alldomServices, setAlldomServices] = useState<AlldomService[]>([]);
  const columns = useAllDomDatagridColumns();

  const {
    flattenData: allDomList,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    isLoading,
    setSorting,
    search,
  } = useResourcesIcebergV2<AlldomService>({
    route: '/domain/alldom',
    queryKey: ['allDom', 'domains', searchInput],
    pageSize: 10,
    columns,
  });

  const { data: serviceList, listLoading } = useGetServices({
    names: allDomList?.map((alldom: AlldomService) => alldom.currentState.name),
    serviceRoute: ServiceRoutes.AllDom,
  });

  useEffect(() => {
    if (allDomList) {
      const services = allDomList.map((alldom) => {
        if (!serviceList || listLoading) {
          return {
            currentState: alldom.currentState,
            nicAdmin: '',
            nicBilling: '',
            nicTechnical: '',
            pendingActions: [],
            renewMode: null,
            expirationDate: '',
            creationDate: '',
            renewalDate: '',
            serviceId: 0,
          } as AlldomService;
        }
        const service = serviceList.find(
          (s) => s.resource.name === alldom.currentState.name,
        );
        const contacts = service.customer?.contacts ?? [];
        const { lifecycle, renew, expirationDate } = service.billing;
        return {
          currentState: alldom.currentState,
          nicAdmin: findContact(contacts, ServiceInfoContactEnum.Administrator),
          nicBilling: findContact(contacts, ServiceInfoContactEnum.Billing),
          nicTechnical: findContact(contacts, ServiceInfoContactEnum.Technical),
          pendingActions: lifecycle?.current.pendingActions ?? [],
          renewMode: renew.current.mode,
          expirationDate,
          creationDate: lifecycle?.current?.creationDate,
          renewalDate: renew?.current?.nextDate,
          serviceId: service.serviceId,
        } as AlldomService;
      });
      setAlldomServices(services);
    }
  }, [allDomList, listLoading, serviceList]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      search.setSearchInput(toASCII(searchInput.toLowerCase()));
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    search.onSearch(search.searchInput);
  }, [search.searchInput]);

  const header = {
    title: t('title'),
  };

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: {
            message: error.message,
          },
        }}
      />
    );
  }

  return (
    <BaseLayout
      header={header}
      message={notifications.length ? <Notifications /> : null}
    >
      <div data-testid="datagrid">
        <Datagrid
          columns={columns}
          items={alldomServices}
          totalItems={allDomList?.length}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          isLoading={isLoading}
          search={{
            searchInput,
            setSearchInput,
            onSearch: () => null,
          }}
        />
        <Outlet />
      </div>
    </BaseLayout>
  );
}
