import React from 'react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { TerminateModal } from '@/components/Modal/terminate/TerminateModal.component';
import { useTerminateOKms } from '@/data/hooks/useTerminateOKms';

export default function TerminateKms() {
  const navigate = useNavigate();
  const { trackPage } = useOvhTracking();
  const { okmsId } = useParams();

  const closeModal = () => {
    navigate('..');
  };

  const { terminateKms, isPending } = useTerminateOKms({
    okmsId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_kms_success',
      });
      closeModal();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'delete_kms_error',
      });
      closeModal();
    },
  });

  return (
    <TerminateModal
      onConfirmTerminate={terminateKms}
      closeModal={closeModal}
      isLoading={isPending}
    />
  );
}
