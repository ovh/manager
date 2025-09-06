import { useContext } from 'react';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMessageContext } from '@/context/Message.context';
import { APP_NAME_TRACKING, TRACKING } from '@/tracking.constants';

export default function TerminateOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('terminate');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { addSuccess } = useMessageContext();

  const closeModal = () => {
    trackClick(TRACKING.dashboardTerminate.cancel);
    navigate('..');
  };

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: `delete_${APP_NAME_TRACKING}_success`,
    });
    const messageKey =
      ovhSubsidiary === 'US'
        ? 'terminate_managed_vcd_ftc_success'
        : 'terminate_managed_vcd_success';
    addSuccess({
      content: t(messageKey, { service: id }),
      isDismissible: true,
    });
    closeModal();
  };
  const onError = (error: ApiError) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: `delete_${APP_NAME_TRACKING}_error::${error.response.data.message
        .toLowerCase()
        .replaceAll(' ', '-')}`,
    });
  };
  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess,
    onError,
  });

  const closeHandler = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['delete_managed-vcd', 'cancel'],
    });
    closeModal();
  };

  const confirmHandler = () => {
    trackClick(TRACKING.dashboardTerminate.confirm);
    terminateService({ resourceName: id });
  };

  return (
    <DeleteModal
      isOpen
      closeModal={closeHandler}
      isLoading={isPending}
      error={isError ? error?.message : null}
      onConfirmDelete={confirmHandler}
    ></DeleteModal>
  );
}
