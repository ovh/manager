import { useContext } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useDeleteService } from '@ovh-ux/manager-network-common';
import {
  DeleteModal,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { fromIdToIp, ipFormatter } from '@/utils';

export default function TerminateIp() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { id } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { t } = useTranslation('listing');
  const { addSuccess } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: 'terminate_additional-ip_success',
    });
    const messageKey =
      ovhSubsidiary === 'US'
        ? 'listingTerminateIp_ftc_success'
        : 'listingTerminateIp_success';
    addSuccess(t(messageKey, { service: ip }));
    closeModal();
  };
  const onError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: 'terminate_additional-ip_error',
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
      actionType: 'action',
      actions: ['terminate_additional-ip', 'cancel'],
    });
    closeModal();
  };

  const confirmHandler = () => {
    const [ipAddress, block] = ip.split('/');
    terminateService({ resourceName: `ip-${block === '32' ? ipAddress : ip}` });

    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['terminate_additional-ip', 'confirm'],
    });
  };

  return (
    <DeleteModal
      isOpen
      closeModal={closeHandler}
      isLoading={isPending}
      error={isError ? error?.message : undefined}
      onConfirmDelete={confirmHandler}
    />
  );
}
