import React, { useState } from 'react';
import {
  Datagrid,
  ErrorBanner,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import Modal from '@/components/Modal/Modal';
import Notification from '@/components/Notification/Notification.component';
import { taskMeDns } from '@/constants';

export default function Domain() {
  const { t: tError } = useTranslation('web-ongoing-operations/error');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const [filterDns, setFilterDns] = useState<TOngoingOperations | null>(null);

  const {
    flattenData: dnsList,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route: taskMeDns,
    queryKey: [taskMeDns],
    pageSize: 30,
  });

  const openModal = (id: number) => {
    setModalOpen(true);
    setFilterDns(
      dnsList.find((element: TOngoingOperations) => element.id === id),
    );
  };

  const closeModal = () => {
    setModalOpen(!modalOpen);
    setFilterDns(null);
  };

  const changeStatus = (label: string, message: string) => {
    setStatus({ label, message });
  };

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.Zone,
    dnsList as TOngoingOperations[],
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
          universe="dns"
          onCloseModal={closeModal}
          data={filterDns}
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

      {dnsList && (
        <div data-testid="dns">
          <Datagrid
            columns={columns}
            items={dnsList}
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
