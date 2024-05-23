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
import { UpdateIamNameModal } from '@ovhcloud/manager-components';
import { useQueryClient } from '@tanstack/react-query';
import { getIamResourceQueryKey, useServiceList } from '@/api';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditEndpointDisplayName() {
  const { id, urn } = useParams();
  const { t } = useTranslation('vrack-services/endpoints');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { iamResources } = useServiceList(id);

  const resource = iamResources?.data.find((r) => r.urn === urn);

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_endpoints', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateIamNameModal
      closeModal={onClose}
      inputLabel={t('updateDisplayNameInputLabel')}
      headline={t('modalUpdateHeadline')}
      description={t('modalUpdateDescription')}
      defaultValue={resource?.displayName}
      resourceName={resource?.name}
      onConfirm={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_endpoints', 'confirm'],
        });
      }}
      onSuccess={() => {
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: PageName.pendingUpdateEndpoint,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: getIamResourceQueryKey([]),
          });
        }, 2000);
        navigate('..');
      }}
      onError={() => {
        trackPage({
          pageType: PageType.bannerError,
          pageName: PageName.errorUpdateEndpoint,
        });
      }}
    />
  );
}
