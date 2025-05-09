import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { DeleteServiceModal } from '@ovh-ux/manager-react-components';
import { useVrackService } from '@ovh-ux/manager-network-common';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { PageName } from '@/utils/tracking';
import { sharedTrackingParams } from './deleteVrackServicesModal.constants';
import { getDisplayName } from '@/utils/vrack-services';

export default function DeleteVrackServicesModal() {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services');
  const { data: vs } = useVrackService();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const navigate = useNavigate();

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <DeleteServiceModal
      isOpen
      closeModal={onClose}
      resourceName={id}
      onSuccess={() => {
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: PageName.successDeleteVrackServices,
        });
        navigate('..');
        addSuccessMessage(
          t('terminateVrackServicesSuccess', {
            vrackServices: getDisplayName(vs),
          }),
          { vrackServicesId: id },
        );
      }}
      onError={() => {
        trackPage({
          pageType: PageType.bannerError,
          pageName: PageName.errorDeleteVrackServices,
        });
      }}
      onConfirmDelete={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['delete_vrack-services', 'confirm'],
        });
      }}
    />
  );
}
