import React from 'react';
import {
  UseUpdateServiceDisplayNameParams,
  useUpdateServiceDisplayName,
} from '../../../hooks/services';
import {
  UpdateNameModal,
  UpdateNameModalProps,
} from './update-name-modal.component';

export type UpdateIamNameModalProps = {
  resourceName: string;
  onConfirm?: () => void;
} & Omit<UpdateNameModalProps, 'error' | 'updateDisplayName'> &
  UseUpdateServiceDisplayNameParams;

export const UpdateIamNameModal: React.FC<UpdateIamNameModalProps> = ({
  onConfirm,
  resourceName,
  onSuccess,
  onError,
  mutationKey,
  isLoading,
  ...props
}) => {
  const {
    updateDisplayName,
    isPending,
    error,
    isError,
  } = useUpdateServiceDisplayName({ onSuccess, onError, mutationKey });

  return (
    <UpdateNameModal
      {...props}
      isLoading={isPending || isLoading}
      error={isError ? error?.response?.data?.message : null}
      updateDisplayName={(displayName) => {
        onConfirm?.();
        updateDisplayName({ resourceName, displayName });
      }}
    />
  );
};
