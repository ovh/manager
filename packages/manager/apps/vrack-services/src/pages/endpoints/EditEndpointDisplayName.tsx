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
import { useServiceList } from '@/api';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/Messages/Messages.context';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditEndpointDisplayName() {
  const { id, urn } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { t } = useTranslation('vrack-services/endpoints');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { iamResources, refetchIamResources } = useServiceList(id);

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
      inputLabel={t('endpointUpdateDisplayNameInputLabel')}
      headline={t('modalEndpointUpdateHeadline')}
      description={t('modalEndpointUpdateDescription')}
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
          pageName: PageName.successUpdateEndpoint,
        });
        navigate('..');
        addSuccessMessage(
          t('endpointUpdateDisplayNameSuccess', {
            name: resource?.name,
          }),
          id,
        );
        setTimeout(() => {
          refetchIamResources();
        }, 2000);
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
