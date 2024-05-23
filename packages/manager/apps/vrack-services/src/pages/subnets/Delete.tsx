import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useOvhTracking,
  ButtonType,
  PageLocation,
  PageType,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovhcloud/manager-components';
import { useVrackService, useUpdateVrackServices } from '@/api';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function SubnetDeleteModal() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id, cidr } = useParams();
  const { trackPage, trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_subnets', 'cancel'],
    });
    navigate('..');
  };
  const cidrToDelete = cidr.replace('_', '/');

  const { data: vs } = useVrackService();
  const {
    deleteSubnet,
    isPending,
    updateError,
    isErrorVisible,
  } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: PageName.pendingDeleteSubnet,
      });
      navigate('..');
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDeleteSubnet,
      });
    },
  });

  return (
    <DeleteModal
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      description={t('modalDeleteDescription')}
      onConfirmDelete={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['delete_subnets', 'confirm'],
        });
        deleteSubnet({ vs, cidrToDelete });
      }}
      error={isErrorVisible ? updateError?.response?.data?.message : null}
      isLoading={isPending}
    />
  );
}
