import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { DeleteServiceModal } from '@ovhcloud/manager-components';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { getDisplayName, useVrackService } from '@/data';
import { PageName } from '@/utils/tracking';
import { sharedTrackingParams } from './deleteVrackServicesModal.constants';

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
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteVrackServicesInputLabel')}
      headline={t('modalDeleteVrackServicesHeadline')}
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
          id,
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
