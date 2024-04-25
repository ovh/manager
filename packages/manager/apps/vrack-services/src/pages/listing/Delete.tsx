import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovhcloud/manager-components';
import { useDeleteVrackServices } from '@/utils/vs-utils';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DeleteVrackServices() {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services/listing');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate('..');
  };

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  const { deleteVs, isErrorVisible, error } = useDeleteVrackServices({
    vrackServices: id,
    onSuccess,
  });

  return (
    <DeleteModal
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      error={isErrorVisible ? error?.response?.data?.message : null}
      onConfirmDelete={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['delete_vrack-services', 'confirm'],
        });
        deleteVs();
      }}
    />
  );
}
