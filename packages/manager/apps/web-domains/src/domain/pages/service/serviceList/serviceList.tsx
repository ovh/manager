import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';

import { ModalOpenChangeDetail } from '@ovhcloud/ods-react';
import { toASCII } from 'punycode';
import appConfig from '@/web-domains.config';
import { DomainService } from '@/domain/types/domainResource';
import { useDomainDatagridColumns } from '@/domain/hooks/useDomainDatagridColumns';
import RenewRestoreModal from '@/domain/components/DatagridColumns/Domain/RenewRestoreModal';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();
  const [isModalOpenned, setIsModalOpenned] = useState(false);
  const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>(
    [],
  );
  const [searchInput, setSearchInput] = useState('');

  const onOpenChange = ({ open }: ModalOpenChangeDetail) => {
    setIsModalOpenned(open);
    if (!open) {
      setSelectedServiceNames([]);
    }
  };

  const openModal = (serviceNames: string[]) => {
    setSelectedServiceNames(serviceNames);
    setIsModalOpenned(true);
  };

  const handleCheckboxToggle = (serviceName: string, checked: boolean) => {
    setSelectedServiceNames((prev) =>
      checked
        ? [...prev, serviceName]
        : prev.filter((name) => name !== serviceName),
    );
  };

  const domainColumns = useDomainDatagridColumns({
    openModal,
    selectedServiceNames,
    onToggleCheckbox: handleCheckboxToggle,
  });

  const {
    flattenData: domainResources,
    isLoading,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    sorting,
    setSorting,
    search,
  } = useResourcesIcebergV6<DomainService>({
    columns: domainColumns,
    route: '/domain',
    queryKey: ['/domain'],
  });

  const header = {
    title: t('title'),
  };
  useEffect(() => {
    const debounce = setTimeout(() => {
      search.setSearchInput(toASCII(searchInput.toLowerCase()));
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    search.onSearch(search.searchInput);
  }, [search.searchInput]);

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
      breadcrumb={
        <Breadcrumb
          rootLabel={t('title')}
          appName={appConfig.rootLabel}
          hideRootLabel
        />
      }
      header={header}
      message={notifications.length ? <Notifications /> : null}
    >
      <div data-testid="datagrid">
        <Datagrid
          isLoading={isLoading}
          columns={domainColumns}
          items={domainResources || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          search={{
            searchInput,
            setSearchInput,
            onSearch: () => null,
          }}
        />
        <RenewRestoreModal
          isModalOpenned={isModalOpenned}
          serviceNames={selectedServiceNames}
          onOpenChange={onOpenChange}
        />
        <Outlet />
      </div>
    </BaseLayout>
  );
}
