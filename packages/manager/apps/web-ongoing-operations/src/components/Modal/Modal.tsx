import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import ModalHeaderComponent from '@/components/Modal/Header/ModalHeader.component';
import ModalContentComponent from '@/components/Modal/Content/ModalContent.component';
import { updateTask } from '@/data/api/web-ongoing-operations';
import { TOngoingOperations } from '@/types';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { OperationName } from '@/enum/operationName.enum';
import { urls } from '@/routes/routes.constant';
import OperationActions from '../Actions/OperationsActions.component';
import { useOperationArguments } from '@/hooks/modal/useOperationArguments';

type IsModalOpenProps = {
  readonly onCloseModal?: () => void;
  readonly data: TOngoingOperations;
  readonly universe: string;
  readonly changeStatus?: (label: string, message: string) => void;
};

export default function Modal({
  universe,
  onCloseModal,
  data,
  changeStatus,
}: IsModalOpenProps) {
  const { t } = useTranslation('dashboard');
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();
  const [operationName, setOperationName] = useState(
    data.canRelaunch ? OperationName.CanRelaunch : null,
  );
  const navigate = useNavigate();
  const putOperationName = (label: OperationName) => {
    setOperationName(label);
  };

  const { data: operationArguments, isLoading, error } = useOperationArguments(
    data.id,
  );

  if (error) {
    navigate(urls.error404);
  }

  const onValidate = async (id: number, operationType: OperationName) => {
    const promiseArray: Promise<void>[] = [];

    if (operationArgumentsUpdated) {
      Object.entries(operationArgumentsUpdated).forEach(([key, value]) => {
        promiseArray.push(updateTask(id, key, { value }));
      });
    }

    Promise.all(promiseArray)
      .then(() => {
        updateOperationStatus(universe, id, operationType)
          .then(() => {
            changeStatus(
              ODS_MESSAGE_COLOR.success,
              t(`domain_operations_${operationType}_success`),
            );
          })
          .catch((e) => {
            changeStatus(ODS_MESSAGE_COLOR.warning, e.message);
          })
          .finally(() => {
            onCloseModal();
          });
      })
      .catch(() => {
        navigate(urls.root);
      });
  };

  const onChange = (key: string, value: string) => {
    setOperationArgumentsUpdated({
      ...operationArgumentsUpdated,
      [key]: value,
    });
  };

  return (
    <OdsModal
      color="information"
      isOpen={true}
      onOdsClose={() => {
        onCloseModal();
      }}
      className="modal"
      data-testid="modal"
    >
      {isLoading ? (
        <OdsSpinner
          color="primary"
          size="md"
          className="flex items-center justify-center"
        />
      ) : (
        <div>
          <ModalHeaderComponent data={data} />
          <div className="my-6 flex flex-col gap-y-4">
            {operationArguments?.data?.map((argument, index) => (
              <div key={`${data.id}-${index}`}>
                <ModalContentComponent
                  argument={argument}
                  operationId={data.id}
                  onChange={onChange}
                  domainName={data.domain}
                />
              </div>
            ))}
          </div>
          {operationArguments.actions && (
            <OperationActions
              data={data}
              operationName={operationName}
              disabled={null}
              putOperationName={putOperationName}
              onValidate={onValidate}
              justify="end"
            />
          )}
        </div>
      )}
    </OdsModal>
  );
}
