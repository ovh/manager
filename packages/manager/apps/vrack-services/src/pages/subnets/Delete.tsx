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
import { useVrackService, useUpdateVrackServices } from '@/utils/vs-utils';
import { DeleteModal } from '@/components/DeleteModal';
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

  const { data: vrackServices } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      navigate('..');
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
        updateVS(
          {
            checksum: vrackServices?.checksum,
            vrackServicesId: vrackServices?.id,
            targetSpec: {
              displayName: vrackServices?.currentState.displayName,
              subnets: vrackServices?.currentState.subnets.filter(
                (subnet) => subnet.cidr !== cidrToDelete,
              ),
            },
          },
          {
            onSuccess: () => {
              trackPage({
                pageType: PageType.bannerInfo,
                pageName: PageName.pendingDeleteSubnet,
              });
            },
            onError: () => {
              trackPage({
                pageType: PageType.bannerError,
                pageName: PageName.errorDeleteSubnet,
              });
            },
          },
        );
      }}
      error={updateError}
      isLoading={isPending}
    />
  );
}
