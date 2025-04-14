import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import pLimit from 'p-limit';
import { useMutation } from '@tanstack/react-query';
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
  readonly operation: TOngoingOperations;
  readonly universe: string;
  readonly changeStatus?: (label: string, message: string) => void;
};

export default function Modal({
  universe,
  onCloseModal,
  operation,
  changeStatus,
}: IsModalOpenProps) {
  const { t } = useTranslation('dashboard');
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();
  const [operationName, setOperationName] = useState(
    operation.canRelaunch ? OperationName.CanRelaunch : null,
  );
  const navigate = useNavigate();
  const putOperationName = (label: OperationName) => {
    setOperationName(label);
  };

  const { data: operationArguments, isLoading, error } = useOperationArguments(
    operation.id,
  );

  if (error) {
    navigate(urls.error404);
  }

  const updateTaskLimit = pLimit(1);

  const { mutate: useUpdateOperationStatus } = useMutation({
    mutationFn: async ({
      operationId,
      operationType,
    }: {
      operationId: number;
      operationType: OperationName;
    }) => {
      await updateOperationStatus(universe, operationId, operationType);
      changeStatus(
        ODS_MESSAGE_COLOR.success,
        t(`domain_operations_${operationType}_success`),
      );
    },
    onError: (e) => {
      changeStatus(ODS_MESSAGE_COLOR.warning, e.message);
    },
    onSettled: () => {
      onCloseModal();
    },
  });

  const { mutate: onValidate } = useMutation({
    mutationFn: async ({
      operationId,
      operationType,
    }: {
      operationId: number;
      operationType: OperationName;
    }) => {
      if (operationArgumentsUpdated) {
        const promises = Object.entries(
          operationArgumentsUpdated,
        ).map(([key, value]) =>
          updateTaskLimit(() => updateTask(operationId, key, { value })),
        );
        await Promise.all(promises);
      }
      return { operationId, operationType };
    },
    onSuccess: (data) => {
      useUpdateOperationStatus(data);
    },
    onError: () => {
      navigate(urls.root);
    },
  });

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
          <ModalHeaderComponent data={operation} />
          <div className="my-6 flex flex-col gap-y-4">
            {operationArguments?.data?.map((argument, index) => (
              <div key={`${operation.id}-${index}`}>
                <ModalContentComponent
                  argument={argument}
                  operationId={operation.id}
                  onChange={onChange}
                  domainName={operation.domain}
                />
              </div>
            ))}
          </div>
          {operationArguments.actions && (
            <OperationActions
              data={operation}
              operationName={operationName}
              disabled={operationName === null}
              putOperationName={putOperationName}
              onValidate={(operationId, type) =>
                onValidate({ operationId, operationType: type })
              }
              justify="end"
            />
          )}
        </div>
      )}
    </OdsModal>
  );
}
