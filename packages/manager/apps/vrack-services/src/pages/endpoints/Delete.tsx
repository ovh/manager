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
import {
  useVrackService,
  useUpdateVrackServices,
  getEligibleManagedServiceListQueryKey,
} from '@/api';
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

  const { data: vs } = useVrackService();
  const {
    deleteEndpoint,
    isPending,
    updateError,
    isErrorVisible,
  } = useUpdateVrackServices({
    key: id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: PageName.pendingDeleteEndpoint,
      });
      navigate('..');
      queryClient.invalidateQueries({
        queryKey: getEligibleManagedServiceListQueryKey(id),
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDeleteEndpoint,
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
        deleteEndpoint({ vs, urnToDelete });
      }}
      error={isErrorVisible ? updateError?.response?.data?.message : null}
      isLoading={isPending}
    />
  );
}
