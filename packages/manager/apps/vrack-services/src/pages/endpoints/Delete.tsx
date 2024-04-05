import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useQueryClient } from '@tanstack/react-query';
import { useVrackService, useUpdateVrackServices } from '@/utils/vs-utils';
import { DeleteModal } from '@/components/DeleteModal';
import { getEligibleManagedServiceListQueryKey } from '@/api';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  getPageProps,
} from '@/utils/tracking';

export default function EndpointsDeleteModal() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id, urn } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onClose = () => {
    navigate('..');
  };
  const {
    shell: {
      tracking: { trackPage },
    },
  } = React.useContext(ShellContext);
  const urnToDelete = urn.replace('_', '/');

  const { data: vrackServices } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({
        queryKey: getEligibleManagedServiceListQueryKey(id),
      });
    },
  });

  return (
    <DeleteModal
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      description={t('modalDeleteDescription')}
      trackingParams={{
        pageName: PageName.deleteEndpoints,
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
              subnets: vrackServices?.currentState.subnets.map((subnet) => ({
                ...subnet,
                serviceEndpoints: subnet.serviceEndpoints.filter(
                  (endpoint) => endpoint.managedServiceURN !== urnToDelete,
                ),
              })),
            },
          },
          {
            onSuccess: async () => {
              trackPage(
                getPageProps({
                  pageType: PageType.bannerInfo,
                  pageName: PageName.pendingDeleteEndpoint,
                }),
              );
            },
            onError: async () => {
              trackPage(
                getPageProps({
                  pageType: PageType.bannerError,
                  pageName: PageName.errorDeleteEndpoint,
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
