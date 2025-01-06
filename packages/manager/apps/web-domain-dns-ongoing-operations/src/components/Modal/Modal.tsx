import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { OdsModalCustomEvent } from '@ovhcloud/ods-components';
import json from '@/json/document.json';
import ModalHeaderComponent from '@/components/Modal/Header/ModalHeader.component';
import ModalActionsComponent from '@/components/Modal/Actions/ModalActions.component';
import ModalContentComponent from './Content/ModalContent.component';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
} from '@/data/api/web-domain-dns-ongoing-operations';
import { operation } from '@/data/api/ongoing-operations-actions';
import { TArgument, TOngoingOperations } from '@/interface';

type IsModalOpenProps = {
  isModalOpen: boolean;
  onCloseModal: () => void;
  data: TOngoingOperations | null;
  universe: string;
  status: string;
};

export default function Modal({
  universe,
  isModalOpen,
  onCloseModal,
  data,
  status,
}: IsModalOpenProps) {
  const [nic, setNic] = useState([]);
  const [argument, setArgument] = useState('' || undefined);
  const [isLoading, setLoading] = useState(false);

  // se servir du getMe pour retourner le tableau.
  useEffect(() => {
    if (isModalOpen) {
      getmeTaskDomainNicList(data.id)
        .then(async (a) => {
          setNic(a.data);
          const argumentsList = await Promise.all(
            a.data.map(async (element: string) => {
              return getmeTaskDomainArgument(data.id, element);
            }),
          );
          setArgument(argumentsList);
        })
        .catch((error) => {
          console.error('Erreur lors des appels API:', error);
        });
    }
  }, [isModalOpen, data.id]);

  const doOperation = async (id: number, operationType: string) => {
    try {
      await operation(universe, id, operationType);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <OdsModal
      color="neutral"
      isOpen={isModalOpen}
      onOdsClose={(_: OdsModalCustomEvent<void>) => onCloseModal()}
    >
      {isLoading ? (
        <OdsSpinner
          color="primary"
          size="md"
          className="flex items-center justify-center"
        />
      ) : (
        <div>
          <ModalHeaderComponent
            heading={data.domain}
            description={data.comment}
          />
          <ModalContentComponent content={argument} />
          <ModalActionsComponent
            data={data}
            onCloseModal={onCloseModal}
            doOperation={doOperation}
          />
        </div>
      )}
    </OdsModal>
  );
}
