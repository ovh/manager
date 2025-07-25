import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  PageType,
  TrackingClickParams,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { UpdateIamNameModal } from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVrackServicesResourceListQueryKey,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditVrackServicesDisplayNameModal() {
  const { id } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { data: vs } = useVrackService();
  const queryClient = useQueryClient();

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateIamNameModal
      isOpen
      closeModal={onClose}
      inputLabel={t('updateVrackServicesDisplayNameInputLabel')}
      headline={t('modalUpdateVrackServicesHeadline', { id })}
      description={t('modalUpdateVrackServicesDescription')}
      resourceName={id}
      onSuccess={() => {
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: PageName.successUpdateVrackServices,
        });
        navigate('..');
        addSuccessMessage(
          t('updateVrackServicesDisplayNameSuccess', {
            vrackServices: id,
          }),
          { vrackServicesId: id },
        );
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: getVrackServicesResourceListQueryKey,
          });
        }, 2000);
      }}
      onError={() => {
        trackPage({
          pageType: PageType.bannerError,
          pageName: PageName.errorUpdateVrackServices,
        });
      }}
      onConfirm={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_vrack-services', 'confirm'],
        });
      }}
      defaultValue={vs?.iam?.displayName}
    />
  );
}
