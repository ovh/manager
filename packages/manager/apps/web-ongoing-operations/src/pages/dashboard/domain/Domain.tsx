import React, { useState } from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { useDomainList } from '@/hooks/data/data';
import { TOngoingOperations } from '@/types';
import Modal from '@/components/Modal/Modal';
import Notification from '@/components/Notification/Notification.component';

export default function Domain() {
  const { data: domainList, isLoading } = useDomainList();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const [filterDomain, setFilterDomain] = useState<TOngoingOperations | null>(
    null,
  );

  const openModal = (id: number) => {
    setModalOpen(true);
    setFilterDomain(
      domainList.find((element: TOngoingOperations) => element.id === id),
    );
  };

  const closeModal = () => {
    setModalOpen(!modalOpen);
    setFilterDomain(null);
  };

  const changeStatus = (label: string, message: string) => {
    setStatus({ label, message });
  };

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.Domain,
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

  return (
    <React.Suspense>
      <Modal
        universe="domain"
        isModalOpen={modalOpen}
        onCloseModal={closeModal}
        data={filterDomain}
        changeStatus={changeStatus}
      />

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
            totalItems={domainList.length}
          />
        </div>
      )}
    </React.Suspense>
  );
}
