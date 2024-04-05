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
  getPageProps,
} from '@/utils/tracking';

export default function SubnetDeleteModal() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id, cidr } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  const {
    shell: {
      tracking: { trackPage },
    },
  } = React.useContext(ShellContext);
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
      trackingParams={{
        pageName: PageName.deleteSubnets,
        pageType: PageType.popup,
        location: PageLocation.popup,
        buttonType: ButtonType.button,
      }}
      onConfirmDelete={() =>
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
        )
      }
      error={updateError}
      isLoading={isPending}
      isModalOpen
    />
  );
}
