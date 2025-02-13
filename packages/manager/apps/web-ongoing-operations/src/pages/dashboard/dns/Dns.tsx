import React, { useState } from 'react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { useDnsList } from '@/hooks/data/data';
import Modal from '@/components/Modal/Modal';
import Notification from '@/components/Notification/Notification.component';

export default function Domain() {
  const { data: dnsList, isLoading } = useDnsList();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const [filterDns, setFilterDns] = useState<TOngoingOperations | null>(null);

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
  return (
    <React.Suspense>
      <Modal
        universe="dns"
        isModalOpen={modalOpen}
        onCloseModal={closeModal}
        data={filterDns}
        changeStatus={changeStatus}
      />

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
            totalItems={dnsList.length}
          />
        </div>
      )}
    </React.Suspense>
  );
}
