import React from 'react';
import {
  useDeleteService,
  UseDeleteServiceParams,
} from '../../../hooks/services';
import { DeleteModal, DeleteModalProps } from './delete-modal.component';

export type DeleteServiceModalProps = {
  resourceName: string;
} & Omit<DeleteModalProps, 'error'> &
  UseDeleteServiceParams;

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  onConfirmDelete,
  resourceName,
  onSuccess,
  onError,
  mutationKey,
  isLoading,
  ...props
}) => {
  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess,
    onError,
    mutationKey,
  });

  return (
    <DeleteModal
      {...props}
      isLoading={isLoading || isPending}
      error={isError ? error?.response?.data?.message : null}
      onConfirmDelete={() => {
        onConfirmDelete?.();
        terminateService({ resourceName });
      }}
    />
  );
};
