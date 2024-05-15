import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TerminateModal } from '@/components/Modal/terminate/TerminateModal.component';
import { useTerminateOKms } from '@/data/hooks/useTerminateOKms';

export default function TerminateKms() {
  const navigate = useNavigate();
  const { okmsId } = useParams();

  const closeModal = () => {
    navigate('..');
  };

  const { terminateKms, isPending } = useTerminateOKms({
    okmsId,
    onSuccess: closeModal,
    onError: closeModal,
  });

  return (
    <TerminateModal
      onConfirmTerminate={terminateKms}
      closeModal={closeModal}
      isLoading={isPending}
    />
  );
}
