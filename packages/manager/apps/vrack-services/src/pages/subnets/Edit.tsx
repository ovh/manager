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
import { useUpdateVrackServices, useVrackService } from '@/api';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditSubnetDisplayName() {
  const { id, cidr } = useParams();
  const { t } = useTranslation('vrack-services/subnets');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const {
    data: vrackServices,
    isPending: isVrackServicesLoading,
    isError,
    error,
  } = useVrackService();
  const {
    updateSubnetDisplayName,
    isPending,
    updateError,
    isErrorVisible,
  } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: PageName.pendingUpdateSubnet,
      });
      navigate('..');
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorUpdateSubnet,
      });
    },
  });

  const errorMessage = React.useMemo(() => {
    if (isError) {
      return error?.response?.data?.message;
    }
    if (isErrorVisible) {
      return updateError?.response?.data?.message;
    }
    return null;
  }, [isError, isError, error, updateError]);

  const subnet = vrackServices.currentState.subnets.find(
    (s) => s.cidr === cidr.replace('_', '/'),
  );

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_subnets', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateNameModal
      closeModal={onClose}
      inputLabel={t('updateDisplayNameInputLabel')}
      headline={t('modalUpdateHeadline')}
      error={errorMessage}
      description={t('modalUpdateDescription')}
      isLoading={isVrackServicesLoading || isPending}
      defaultValue={subnet?.displayName}
      updateDisplayName={(displayName) => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_subnets', 'confirm'],
        });
        updateSubnetDisplayName({
          displayName,
          cidr: cidr.replace('_', '/'),
          vs: vrackServices,
        });
      }}
    />
  );
}
