import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useUpdateServiceDisplayName } from '@ovh-ux/manager-module-common-api';
import {
  getVrackServicesResourceListQueryKey,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import type { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';
import { UpdateNameModal } from '@ovh-ux/muk';

import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditVrackServicesDisplayNameModal() {
  const { id } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { data: vs } = useVrackService();
  const queryClient = useQueryClient();

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: PageName.successUpdateVrackServices,
    });
    navigate('..');
    addSuccessMessage(
      t('updateVrackServicesDisplayNameSuccess', {
        vrackServices: id,
      }),
      { vrackServicesId: id },
    );
    setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
    }, 2000);
  };

  const onError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PageName.errorUpdateVrackServices,
    });
  };

  const { updateDisplayName, isPending, error, isError } = useUpdateServiceDisplayName({
    onSuccess,
    onError,
  });

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateNameModal
      isOpen
      onClose={onClose}
      onOpenChange={onClose}
      isLoading={isPending}
      error={isError ? error?.response?.data?.message : null}
      inputLabel={t('updateVrackServicesDisplayNameInputLabel')}
      headline={t('modalUpdateVrackServicesHeadline', { id })}
      description={t('modalUpdateVrackServicesDescription')}
      updateDisplayName={(displayName) => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_vrack-services', 'confirm'],
        });
        updateDisplayName({ resourceName: id || '', displayName });
      }}
      defaultValue={vs?.iam?.displayName}
    />
  );
}
