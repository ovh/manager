import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import ModalHeaderComponent from '@/components/Modal/Header/ModalHeader.component';
import ModalContentComponent from '@/components/Modal/Content/ModalContent.component';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainNicList,
  updateTask,
} from '@/data/api/web-ongoing-operations';
import { TOngoingOperations } from '@/types';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { OperationName } from '@/enum/operationName.enum';
import { urls } from '@/routes/routes.constant';
import OperationActions from '../Actions/OperationsActions.component';

type IsModalOpenProps = {
  readonly isModalOpen: boolean;
  readonly onCloseModal?: () => void;
  readonly data: TOngoingOperations;
  readonly universe: string;
  readonly changeStatus?: (label: string, message: string) => void;
};

export default function Modal({
  universe,
  isModalOpen,
  onCloseModal,
  data,
  changeStatus,
}: IsModalOpenProps) {
  const [operationArguments, setOperationArguments] = useState([]);
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [actions, setActions] = useState<boolean>(false);
  const [operationName, setOperationName] = useState(null);
  const navigate = useNavigate();
  const putOperationName = (label: OperationName) => {
    setOperationName(label);
  };

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      getmeTaskDomainNicList(data.id)
        .then((nicList) => {
          const promises = nicList.map((element: string) =>
            getmeTaskDomainArgument(data.id, element),
          );
          return Promise.all(promises);
        })
        .then((argument) => {
          setOperationArguments(argument);
          argument.some((argumentItem) => {
            if (
              argumentItem.type === '/me/contact' ||
              argumentItem.type === 'string' ||
              argumentItem.type === '/me'
            ) {
              return setActions(true);
            }
            return null;
          });
          setLoading(false);
        })
        .catch(() => {
          navigate(urls.error404);
        });
    }
  }, [isModalOpen, data?.id]);

  const onValidate = async (id: number, operationType: OperationName) => {
    const promiseArray: Promise<void>[] = [];

    if (operationArgumentsUpdated) {
      Object.entries(operationArgumentsUpdated).forEach(([key, value]) => {
        promiseArray.push(updateTask(id, key, { value }));
      });
    }

    Promise.all(promiseArray)
      .then(() => {
        setLoading(true);
        updateOperationStatus(universe, id, operationType)
          .then(() => {
            setLoading(false);
          })
          .catch((e) => {
            changeStatus(ODS_MESSAGE_COLOR.warning, e.message);
          })
          .finally(() => {
            onCloseModal();
          });
      })
      .catch((error) => {
        navigate(urls.domain);
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
          data-testid="modal"
        >
          {loading ? (
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
                  <div key={`${data.id}-${index}`}>
                    <ModalContentComponent
                      data={argument}
                      domainId={data.id}
                      onChange={onChange}
                    />
                  </div>
                ))}
              </div>
              {actions && (
                <OperationActions
                  data={data}
                  operationName={operationName}
                  disabled={null}
                  putOperationName={putOperationName}
                  onValidate={onValidate}
                />
              )}
            </div>
          )}
        </OdsModal>
      )}
    </>
  );
}
