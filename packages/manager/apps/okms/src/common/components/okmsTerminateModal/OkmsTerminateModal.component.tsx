import React, { useContext } from 'react';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DeleteModal,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { okmsQueryKeys } from '@/data/api/okms';

type OkmsTerminateModalProps = {
  okmsId: string;
};

export default function OkmsTerminateModal({
  okmsId,
}: OkmsTerminateModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'key-management-service/terminate',
    NAMESPACES.ERROR,
  ]);
  const { trackPage, trackClick } = useOvhTracking();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: okmsQueryKeys.detail(okmsId),
    });
    closeModal();
    clearNotifications();
    addSuccess(
      t(
        ovhSubsidiary === 'US'
          ? 'key_management_service_terminate_success_banner_us'
          : 'key_management_service_terminate_success_banner',
        {
          ServiceName: okmsId,
        },
      ),
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
      t('error_message', {
        message: result.message,
        ns: NAMESPACES.ERROR,
      }),
      true,
    );
    trackPage({
      pageType: PageType.bannerError,
      pageName: 'delete_kms_error',
    });
  };

  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess,
    onError,
  });

  return (
    <DeleteModal
      isOpen
      isLoading={isPending}
      error={isError ? error?.message : undefined}
      closeModal={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete_kms', 'cancel'],
        });
        closeModal();
      }}
      onConfirmDelete={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete_kms', 'confirm'],
        });
        terminateService({ resourceName: okmsId });
      }}
    />
  );
}
