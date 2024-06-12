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
} from '@/data';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';

export default function EndpointsDeleteModal() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id, urn } = useParams();
  const urnToDelete = urn.replace('_', '/');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { trackPage, trackClick } = useOvhTracking();
  const { data: vs } = useVrackService();

  const onClose = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['delete_endpoints', 'cancel'],
    });
    navigate('..');
  };

  const {
    deleteEndpoint,
    isPending,
    updateError,
    isError,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteEndpoint,
      });
      navigate('..');
      queryClient.invalidateQueries({
        queryKey: getEligibleManagedServiceListQueryKey(id),
      });
      addSuccessMessage(t('endpointDeleteSuccess', { id }), id);
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
      deleteInputLabel={t('modalDeleteEndpointInputLabel')}
      headline={t('modalDeleteEndpointHeadline')}
      description={t('modalDeleteEndpointDescription')}
      onConfirmDelete={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_endpoints', 'confirm'],
        });
        deleteEndpoint({ vs, urnToDelete });
      }}
      error={isError ? updateError?.response?.data?.message : null}
      isLoading={isPending}
    />
  );
}
