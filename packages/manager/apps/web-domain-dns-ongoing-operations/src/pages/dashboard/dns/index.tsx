import React, { useEffect, useState } from 'react';

import {
  Datagrid,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';

import { OdsMessage } from '@ovhcloud/ods-components/react';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import { useDatagridColumn } from '@/hooks/useDatagridColumns';
import Modal from '@/components/Modal/Modal';

export default function Domain() {
  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    pageIndex,
  } = useResourcesIcebergV6({
    route: `/me/task/dns`,
    queryKey: ['web-domain-dns-ongoing-operations', `/me/task/dns`],
  });
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [dnsData, setDnsData] = useState(null);
  const [status, setStatus] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<string>('');

  const openModal = (id: number) => {
    setModalOpen(!isModalOpen);
    const dnsFilter = flattenData.filter(
      (element: any) => element.id === id,
    );
    setDnsData(dnsFilter[0]);
  };

  const closeModal = () => {
    setModalOpen(!isModalOpen);
  };

  const changeStatus = (label: string, message: string) => {
    setStatus(label);
    setStatusMessage(message);
  };

  const columns = useDatagridColumn(openModal, true, flattenData);

  if (isError) {
    return <ErrorBanner error={error.message} />;
  }

  if (isLoading && pageIndex === 1) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <React.Suspense>
      <Modal
        universe="domain"
        isModalOpen={isModalOpen}
        onCloseModal={closeModal}
        data={dnsData}
        changeStatus={changeStatus}
      />

      {status === 'success' && (
        <OdsMessage
          color="success"
          className="w-full mb-4"
          onOdsRemove={() => changeStatus('', '')}
        >
          Message de notification success
        </OdsMessage>
      )}

      {status === 'warning' && (
        <OdsMessage
          color="warning"
          className="w-full mb-4"
          onOdsRemove={() => changeStatus('', '')}
        >
          Une erreur s'est produite lors du relancement de l'opération : {statusMessage}
        </OdsMessage>
      )}

      {flattenData && (
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
        />
      )}
    </React.Suspense>
  );
}
