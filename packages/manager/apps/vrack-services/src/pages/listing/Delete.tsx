import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteServiceModal } from '@ovhcloud/manager-components';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DeleteVrackServices() {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services/listing');
  const { trackClick } = useOvhTracking();
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
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      resourceName={id}
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
