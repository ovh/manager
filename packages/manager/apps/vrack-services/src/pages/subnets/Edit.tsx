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
import { getDisplayName, useUpdateVrackServices, useVrackService } from '@/api';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/Messages/Messages.context';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditSubnetDisplayName() {
  const { id, cidr } = useParams();
  const subnetCidr = cidr.replace('_', '/');
  const { t } = useTranslation('vrack-services/subnets');
  const { addSuccessMessage } = React.useContext(MessagesContext);
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
    isError: isUpdateError,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successUpdateSubnet,
      });
      navigate('..');
      addSuccessMessage(
        t('subnetUpdateSuccess', { id: getDisplayName(vrackServices) }),
        id,
      );
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorUpdateSubnet,
      });
    },
  });

  const subnet = vrackServices.currentState.subnets.find(
    (s) => s.cidr === subnetCidr,
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
      inputLabel={t('subnetUpdateDisplayNameInputLabel')}
      headline={t('modalSubnetUpdateHeadline')}
      error={
        isError || isUpdateError
          ? (error || updateError)?.response?.data?.message
          : null
      }
      description={t('modalSubnetUpdateDescription')}
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
          cidr: subnetCidr,
          vs: vrackServices,
        });
      }}
    />
  );
}
