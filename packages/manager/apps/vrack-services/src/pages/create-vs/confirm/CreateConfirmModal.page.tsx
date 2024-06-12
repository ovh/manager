import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  OrderDescription,
  getDeliveringOrderQueryKey,
} from '@ovh-ux/manager-module-order';
import { urls } from '@/routes/routes.constants';
import { VrackConfirmModal } from './VrackConfirmModal.component';

export default function CreateConfirmModal() {
  const { region } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onClose = () => {
    navigate('..');
  };

  return (
    <VrackConfirmModal
      displayName={state?.displayName}
      selectedRegion={region}
      onCancel={onClose}
      onDeny={() => {
        onClose();
        queryClient.invalidateQueries({
          queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
        });
        navigate(urls.listing);
      }}
      onConfirm={() => {
        onClose();
        queryClient.invalidateQueries({
          queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
        });
        queryClient.invalidateQueries({
          queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
        });
        navigate(urls.listing);
      }}
    />
  );
}
