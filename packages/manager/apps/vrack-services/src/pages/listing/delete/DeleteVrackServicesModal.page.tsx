import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { useVrackService } from '@ovh-ux/manager-network-common';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import type { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovh-ux/muk';

import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { PageName } from '@/utils/tracking';
import { getDisplayName } from '@/utils/vrack-services';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DeleteVrackServicesModal() {
  const { id } = useParams();
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const { data: vs } = useVrackService();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const navigate = useNavigate();

  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteVrackServices,
      });
      navigate('..');
      addSuccessMessage(
        t('terminateVrackServicesSuccess', {
          vrackServices: getDisplayName(vs) || '',
        }),
        { vrackServicesId: id },
      );
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDeleteVrackServices,
      });
    },
  });

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <DeleteModal
      open
      onClose={onClose}
      serviceTypeName={t('modalDeleteVrackServicesServiceTypeName')}
      isLoading={isPending}
      onConfirmDelete={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['delete_vrack-services', 'confirm'],
        });
        terminateService({ resourceName: id || '' });
      }}
      error={isError && error?.response?.data?.message ? error.response.data.message : undefined}
    />
  );
}
