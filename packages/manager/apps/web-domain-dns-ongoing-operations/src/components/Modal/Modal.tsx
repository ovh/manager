import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { OdsModalCustomEvent } from '@ovhcloud/ods-components';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';
import json from '@/json/document.json';
import ModalHeaderComponent from '@/components/Modal/Header/ModalHeader.component';
import ModalActionsComponent from '@/components/Modal/Actions/ModalActions.component';
import ModalContentComponent from './Content/ModalContent.component';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
} from '@/data/api/web-domain-dns-ongoing-operations';
import { useDoOperation } from '@/hooks/actions/useActions';
import { TArgument, TArgumentData, TOngoingOperations } from '@/interface';

type IsModalOpenProps = {
  isModalOpen: boolean;
  onCloseModal: () => void;
  data: TOngoingOperations | null;
  universe: string;
  changeStatus: (label: string, message: string) => void;
};

export default function Modal({
  universe,
  isModalOpen,
  onCloseModal,
  data,
  changeStatus,
}: IsModalOpenProps) {
  const [nic, setNic] = useState([]);
  const [argument, setArgument] = useState<TArgumentData[]>([] || undefined);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDocument, setDocument] = useState<boolean>(false);
  const [domainId, setDomainId] = useState<number>(0);
  useEffect(() => {
    if (isModalOpen) {
      getmeTaskDomainNicList(data.id)
        .then(async (a) => {
          setNic(a.data);
          setDomainId(data.id);
          const argumentsList = await Promise.all(
            a.data.map(async (element: string) => {
              return getmeTaskDomainArgument(data.id, element);
            }),
          );
          setArgument(argumentsList);
          argumentsList.some((al) => {
            if (al.data.type === '/me/document') {
              return setDocument(true);
            }
            return setDocument(false);
          });
        })
        .catch((error) => {
          console.error('Erreur lors des appels API:', error);
        });
    }
  }, [isModalOpen, data?.id]);

  const doOperation = async (id: number, operationType: string) => {
    await useDoOperation(universe, id, operationType);
    onCloseModal();
  };

  return (
    <>
      {data && (
        <OdsModal
          color="neutral"
          isOpen={isModalOpen}
          onOdsClose={(_: OdsModalCustomEvent<void>) => {
            onCloseModal();
            setDocument(false);
          }}
          className="modal"
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
              <ModalContentComponent content={argument} domainId={domainId} />
              {!isDocument && (
                <ModalActionsComponent
                  data={data}
                  onCloseModal={onCloseModal}
                  doOperation={doOperation}
                />
              )}
            </div>
          )}
        </OdsModal>
      )}
    </>
  );
}
