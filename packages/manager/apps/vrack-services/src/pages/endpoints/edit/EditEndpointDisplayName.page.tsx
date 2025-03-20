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
import { UpdateIamNameModal } from '@ovh-ux/manager-react-components';
import { useServiceList } from '@ovh-ux/manager-network-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import {
  getIamResourceQueryKey,
  getIamResource,
} from '@/data/api/get/iamResource';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditEndpointDisplayName() {
  const { id, urn } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { t } = useTranslation('vrack-services/endpoints');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { iamResources, refetchIamResources } = useServiceList(id, {
    getIamResourceQueryKey,
    getIamResource,
  });

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
      isOpen
      closeModal={onClose}
      inputLabel={t('endpointUpdateDisplayNameInputLabel')}
      headline={t('modalEndpointUpdateHeadline', {
        name: resource?.name,
      })}
      description={t('modalEndpointUpdateDescription')}
      defaultValue={resource?.displayName}
      resourceName={resource?.name}
      confirmButtonLabel={tActions('modify')}
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
          { vrackServicesId: id },
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
