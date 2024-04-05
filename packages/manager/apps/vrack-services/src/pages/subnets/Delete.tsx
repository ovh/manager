import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useVrackService, useUpdateVrackServices } from '@/utils/vs-utils';
import { DeleteModal } from '@/components/DeleteModal';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  TrackingClickParams,
  getClickProps,
  getPageProps,
} from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  pageName: PageName.deleteSubnets,
  pageType: PageType.popup,
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function SubnetDeleteModal() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id, cidr } = useParams();
  const {
    shell: {
      tracking: { trackPage, trackClick },
    },
  } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const onClose = () => {
    trackClick(
      getClickProps({
        ...sharedTrackingParams,
        actionType: 'exit',
        actions: ['cancel'],
      }),
    );
    navigate('..');
  };
  const cidrToDelete = cidr.replace('_', '/');

  const { data: vrackServices } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <DeleteModal
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      description={t('modalDeleteDescription')}
      onConfirmDelete={() => {
        trackClick(
          getClickProps({
            ...sharedTrackingParams,
            actionType: 'action',
            actions: ['confirm'],
          }),
        );
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
              trackPage(
                getPageProps({
                  pageType: PageType.bannerInfo,
                  pageName: PageName.pendingDeleteSubnet,
                }),
              );
            },
            onError: () => {
              trackPage(
                getPageProps({
                  pageType: PageType.bannerError,
                  pageName: PageName.errorDeleteSubnet,
                }),
              );
            },
          },
        );
      }}
      error={updateError}
      isLoading={isPending}
      isModalOpen
    />
  );
}
