import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  useResourcesIcebergV6,
  ErrorBanner,
  useNotifications,
  Notifications,
} from '@ovh-ux/manager-react-components';
import Loading from '@/alldoms/components/Loading/Loading';

import appConfig from '@/web-domains.config';
import { useAllDomDatagridColumns } from '@/alldoms/hooks/useAllDomDatagridColumns';
import { useGetDatagridServiceInfoList } from '@/alldoms/hooks/data/useDatagridServiceInfoList';
import { TServiceDetail, TServiceProperty } from '@/alldoms/types';
import Modal from '@/alldoms/components/Modal/Modal';

export default function ServiceList() {
  const { t } = useTranslation(['allDom', 'web-domains/error']);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [serviceInfoDetail, setServiceInfoDetail] = useState<TServiceDetail>(
    null,
  );
  const { notifications } = useNotifications();

  const {
    flattenData: allDomList,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    totalCount,
    setSorting,
  } = useResourcesIcebergV6<TServiceProperty>({
    route: '/allDom',
    queryKey: ['/allDom'],
    pageSize: 30,
  });

  const { serviceInfoList, listLoading } = useGetDatagridServiceInfoList({
    allDomList,
  });

  const openModal = (serviceInfoFilter: TServiceDetail) => {
    setIsModalOpen(true);
    setServiceInfoDetail(serviceInfoFilter);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServiceInfoDetail(null);
  };

  const columns = useAllDomDatagridColumns(openModal);

  const header = {
    title: t('title'),
  };

  if (listLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: error.message },
        }}
      />
    );
  }

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={appConfig.rootLabel} appName="web-domains" />
      }
      header={header}
      message={notifications.length ? <Notifications /> : null}
    >
      {serviceInfoDetail && (
        <Modal
          serviceDetail={serviceInfoDetail}
          closeModal={closeModal}
          modalOpen={isModalOpen}
        />
      )}
      <React.Suspense>
        <div data-testid="datagrid">
          <Datagrid
            columns={columns}
            items={serviceInfoList}
            totalItems={totalCount}
            hasNextPage={hasNextPage}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
          />
        </div>
      </React.Suspense>
    </BaseLayout>
  );
}
