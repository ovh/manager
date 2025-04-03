import React, { useState } from 'react';
import {
  Datagrid,
  ErrorBanner,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading/Loading';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { taskMeDomain } from '@/constants';
import { TOngoingOperations } from '@/types';
import Modal from '@/components/Modal/Modal';
import Notification from '@/components/Notification/Notification.component';
import { ParentEnum } from '@/enum/parent.enum';

export default function Domain() {
  const { t: tError } = useTranslation('web-ongoing-operations/error');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const [filterDomain, setFilterDomain] = useState<TOngoingOperations | null>(
    null,
  );

  const {
    flattenData: domainList,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
    refetch,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route: taskMeDomain,
    queryKey: [taskMeDomain],
    pageSize: 30,
  });

  const openModal = (id: number) => {
    setModalOpen(true);
    setFilterDomain(
      domainList.find((element: TOngoingOperations) => element.id === id),
    );
  };

  const closeModal = () => {
    setModalOpen(!modalOpen);
    setFilterDomain(null);
    refetch();
  };

  const changeStatus = (label: string, message: string) => {
    setStatus({ label, message });
  };

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.DOMAIN,
    domainList,
    openModal,
  );

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: tError('manager_error_page_default') },
        }}
      />
    );
  }

  return (
    <React.Suspense>
      {modalOpen && (
        <Modal
          universe="domain"
          onCloseModal={closeModal}
          data={filterDomain}
          changeStatus={changeStatus}
        />
      )}

      {status.label && (
        <Notification
          label={status.label}
          message={status.message}
          removeMessage={() => setStatus(defaultStatus)}
        />
      )}

      {domainList && (
        <div data-testid="datagrid">
          <Datagrid
            columns={columns}
            items={domainList}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            filters={filters}
          />
        </div>
      )}
    </React.Suspense>
  );
}
