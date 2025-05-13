import React from 'react';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DeleteServiceModal,
  defaultDeleteModalTerminateValue,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { getOkmsServicesResourceListQueryKey } from '@/data/api/okms';

export default function TerminateKms() {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/terminate');
  const { okmsId } = useParams();
  const { trackPage, trackClick } = useOvhTracking();
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: getOkmsServicesResourceListQueryKey,
    });
    closeModal();
    clearNotifications();
    addSuccess(
      t('key_management_service_terminate_success_banner', {
        ServiceName: okmsId,
      }),
      true,
    );
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: 'delete_kms_success',
    });
  };

  const onError = (result: ApiError) => {
    closeModal();
    clearNotifications();
    addError(
      t('key_management_service_terminate_error', {
        error: result.message,
      }),
      true,
    );
    trackPage({
      pageType: PageType.bannerError,
      pageName: 'delete_kms_error',
    });
  };

  return (
    <DeleteServiceModal
      isOpen
      headline={t('key_management_service_terminate_heading')}
      deleteInputLabel={t('key_management_service_terminate_description', {
        terminateKeyword: defaultDeleteModalTerminateValue,
      })}
      onSuccess={onSuccess}
      onError={onError}
      closeModal={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete_kms', 'cancel'],
        });
        closeModal();
      }}
      resourceName={okmsId}
      onConfirmDelete={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete_kms', 'confirm'],
        });
      }}
    />
  );
}
