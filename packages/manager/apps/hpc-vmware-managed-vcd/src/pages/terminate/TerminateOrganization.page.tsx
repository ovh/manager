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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMessageContext } from '@/context/Message.context';

export default function TerminateOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('terminate');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { addSuccess } = useMessageContext();
  const {
    state: { messageOptions },
  } = useLocation();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: 'delete_managed-vcd_success',
    });
    const messageKey =
      ovhSubsidiary === 'US'
        ? 'terminate_managed_vcd_ftc_success'
        : 'terminate_managed_vcd_success';
    addSuccess({
      content: t(messageKey, { service: id }),
      ...messageOptions,
    });
    closeModal();
  };
  const onError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: 'delete_managed_vcd_error',
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
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_managed-vcd', 'confirm'],
    });
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
