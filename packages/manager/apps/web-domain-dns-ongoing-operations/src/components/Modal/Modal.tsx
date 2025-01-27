import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { OdsModalCustomEvent } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import ModalHeaderComponent from '@/components/Modal/Header/ModalHeader.component';
import ModalActionsComponent from '@/components/Modal/Actions/ModalActions.component';
import ModalContentComponent from './Content/ModalContent.component';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
} from '@/data/api/web-domain-dns-ongoing-operations';
import { useDoOperation } from '@/hooks/actions/useActions';
import { TArgumentData, TOngoingOperations } from '@/interface';
import { urls } from '@/routes/routes.constant';

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
}: IsModalOpenProps) {
  const [nic, setNic] = useState([]);
  const [argument, setArgument] = useState<TArgumentData[]>([] || undefined);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isActions, setActions] = useState<boolean>(false);
  const [domainId, setDomainId] = useState<string>('');
  const navigate = useNavigate();
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
            if (
              al.data.type === '/me/contact' ||
              al.data.type === 'string' ||
              al.data.type === '/me'
            ) {
              return setActions(true);
            }
          });
        })
        .catch(() => {
          navigate(urls.error404);
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
            setActions(false);
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
              {isActions && (
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
