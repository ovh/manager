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
import { UpdateNameModal } from '@ovhcloud/manager-components';
import { useVrackService, useUpdateVrackServicesName } from '@/api';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditVrackServices() {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services/listing');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { data: vs } = useVrackService();
  const {
    updateVSName,
    isPending,
    error,
    isErrorVisible,
  } = useUpdateVrackServicesName({
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.pendingUpdateVrackServices,
      });
      navigate('..');
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorUpdateVrackServices,
      });
    },
  });

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateNameModal
      closeModal={onClose}
      inputLabel={t('updateDisplayNameInputLabel')}
      headline={t('modalUpdateHeadline')}
      error={isErrorVisible ? error?.response?.data?.message : null}
      description={t('modalUpdateDescription')}
      isLoading={isPending}
      defaultValue={vs?.iam?.displayName}
      updateDisplayName={(displayName) => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_vrack-services', 'confirm'],
        });
        updateVSName({ displayName, vrackServices: id });
      }}
    />
  );
}
