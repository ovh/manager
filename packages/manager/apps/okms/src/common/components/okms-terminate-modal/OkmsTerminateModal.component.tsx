import { useNavigate } from 'react-router-dom';

import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { DeleteModal, useNotifications } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useShellContext } from '@/common/hooks/useShellContext';

type OkmsTerminateModalProps = {
  okmsId: string;
};

export default function OkmsTerminateModal({ okmsId }: OkmsTerminateModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['key-management-service/terminate', NAMESPACES.ERROR]);
  const { trackClick, trackPage } = useOkmsTracking();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { ovhSubsidiary } = useShellContext().environment.getUser();

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
      pageTags: ['delete', 'okms'],
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
      pageTags: ['delete', 'okms'],
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
          actions: ['delete', 'okms', 'cancel'],
        });
        closeModal();
      }}
      onConfirmDelete={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['delete', 'okms', 'confirm'],
        });
        terminateService({ resourceName: okmsId });
      }}
    />
  );
}
