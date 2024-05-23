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
import { UpdateIamNameModal } from '@ovhcloud/manager-components';
import { useVrackService } from '@/api';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditVrackServices() {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { data: vs } = useVrackService();

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
      closeModal={onClose}
      inputLabel={t('updateDisplayNameInputLabel')}
      headline={t('modalUpdateHeadline', { id })}
      description={t('modalUpdateDescription')}
      resourceName={id}
      onSuccess={() => {
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: PageName.pendingUpdateVrackServices,
        });
        navigate('..');
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
