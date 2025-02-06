import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalHeaderComponent from '@/components/Modal/Header/ModalHeader.component';
import ModalActionsComponent from '@/components/Modal/Actions/ModalActions.component';
import ModalContentComponent from './Content/ModalContent.component';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
  updateTask,
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
  const [operationArguments, setOperationArguments] = useState<TArgumentData[]>(
    [],
  );
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();

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
          setOperationArguments(argumentsList);
          argumentsList.some((al) => {
            if (
              al.data.type === '/me/contact' ||
              al.data.type === 'string' ||
              al.data.type === '/me'
            ) {
              return setActions(true);
            }
            return null;
          });
        })
        .catch(() => {
          navigate(urls.error404);
        });
    }
  }, [isModalOpen, data?.id]);

  const doOperation = async (id: number, operationType: string) => {
    const promiseArray: Promise<void>[] = [];
    Object.entries(operationArgumentsUpdated).forEach(([key, value]) => {
      promiseArray.push(updateTask(id, key, { value }));
    });

    Promise.all(promiseArray)
      .then(() => {
        useDoOperation(universe, id, operationType).then(() => {
          onCloseModal();
        });
      })
      .catch(() => {
        // TODO print error to customer
      });
  };

  const onChange = (key: string, value: string) => {
    setOperationArgumentsUpdated({
      ...operationArgumentsUpdated,
      [key]: value,
    });
  };

  return (
    <>
      {data && (
        <OdsModal
          color="neutral"
          isOpen={isModalOpen}
          onOdsClose={() => {
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
              <div className="my-6 flex flex-col gap-y-4">
                {operationArguments?.map((argument, index) => (
                  <div key={`${domainId}-${index}`}>
                    <ModalContentComponent
                      data={argument.data}
                      domainId={domainId}
                      onChange={onChange}
                    />
                  </div>
                ))}
              </div>
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
