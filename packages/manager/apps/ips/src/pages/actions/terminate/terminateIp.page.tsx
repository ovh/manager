import React, { useContext } from 'react';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function TerminateIp() {
  const navigate = useNavigate();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { id } = useParams();
  const { ip, isGroup } = ipFormatter(fromIdToIp(id));
  const { t } = useTranslation('listing');
  const { addSuccess } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: 'delete_ip_success',
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
      pageName: 'delete_ip_error',
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
      actions: ['delete_ip', 'cancel'],
    });
    closeModal();
  };

  const confirmHandler = () => {
    const [ipAddress, block] = ip.split('/');
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_ip', 'confirm'],
    });
    terminateService({ resourceName: `ip-${block === '32' ? ipAddress : ip}` });
  };

  return (
    <DeleteModal
      isOpen
      deleteInputLabel={t('listingTerminateIp_confirm_input')}
      headline={t('listingTerminateIp_confirm_Headline')}
      description={t('listingTerminateIp_confirm_description')}
      closeModal={closeHandler}
      isLoading={isPending}
      error={isError ? error?.message : null}
      onConfirmDelete={confirmHandler}
    ></DeleteModal>
  );
}
