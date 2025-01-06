import React, { useState } from 'react';

import {
  Datagrid,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';

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
  const [dnsData, setDnsData] = useState({});

  const openModal = (id: number) => {
    setModalOpen(!isModalOpen);
    // @ts-ignore
    const dnsFilter = flattenData.filter((element) => element.id === id)
    setDnsData(dnsFilter[0]);
  };

  const closeModal = () => {
    setModalOpen(!isModalOpen);
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
        universe='dns'
        isModalOpen={isModalOpen}
        onCloseModal={closeModal}
        // @ts-ignore
        data={dnsData}
      />
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
