import React from 'react';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DeleteModal,
  defaultDeleteModalTerminateValue,
} from '@ovh-ux/manager-react-components';
import { useTerminateOKms } from '@/data/hooks/useTerminateOKms';

export default function TerminateKms() {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/terminate');
  const { okmsId } = useParams();
  const { trackPage, trackClick } = useOvhTracking();

  const { terminateKms, isPending } = useTerminateOKms({
    okmsId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_kms_success',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'delete_kms_error',
      });
    },
    onSettled: () => {
      navigate('..');
    },
  });

  return (
    <DeleteModal
      isOpen
      headline={t('key_management_service_terminate_heading')}
      closeModal={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete_kms', 'cancel'],
        });
        navigate('..');
      }}
      isLoading={isPending}
      onConfirmDelete={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete_kms', 'confirm'],
        });
        terminateKms();
      }}
      deleteInputLabel={t('key_management_service_terminate_description', {
        terminateKeyword: defaultDeleteModalTerminateValue,
      })}
    />
  );
}
