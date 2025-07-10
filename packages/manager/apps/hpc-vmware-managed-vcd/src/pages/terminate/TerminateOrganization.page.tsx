import { useContext } from 'react';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import {
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMessageContext } from '@/context/Message.context';
import { TERMINATE_TRACKING_KEY, TRACKING } from '@/tracking.constants';

export default function TerminateOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('terminate');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { addSuccess } = useMessageContext();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: `${TERMINATE_TRACKING_KEY}_success`,
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

  const onError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: `${TERMINATE_TRACKING_KEY}_error`,
    });
  };

  const onMutate = () => {
    trackPage({
      pageType: PageType.bannerInfo,
      pageName: `${TERMINATE_TRACKING_KEY}_pending`,
    });
  };

  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess,
    onError,
    onMutate,
  });

  const closeHandler = () => {
    trackClick(TRACKING.terminate.modalCancel);
    closeModal();
  };

  const confirmHandler = () => {
    trackClick(TRACKING.terminate.modalConfirm);
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
