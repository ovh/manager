import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovhcloud/manager-components';
import { useVrackService, useUpdateVrackServices } from '@/utils/vs-utils';
import { getEligibleManagedServiceListQueryKey } from '@/api';
import { PageName } from '@/utils/tracking';

export default function EndpointsDeleteModal() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id, urn } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { trackPage, trackClick } = useOvhTracking();
  const urnToDelete = urn.replace('_', '/');

  const onClose = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['delete_endpoints', 'cancel'],
    });
    navigate('..');
  };

  const { data: vrackServices } = useVrackService();
  const { updateVS, isPending, updateError } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      navigate('..');
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
      onConfirmDelete={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_endpoints', 'confirm'],
        });
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
              trackPage({
                pageType: PageType.bannerInfo,
                pageName: PageName.pendingDeleteEndpoint,
              });
            },
            onError: async () => {
              trackPage({
                pageType: PageType.bannerError,
                pageName: PageName.errorDeleteEndpoint,
              });
            },
          },
        );
      }}
      error={updateError?.response?.data?.message}
      isLoading={isPending}
    />
  );
}
