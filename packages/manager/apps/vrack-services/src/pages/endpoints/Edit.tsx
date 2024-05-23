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
import { UpdateNameModal } from '@ovhcloud/manager-components';
import {
  useVrackService,
  useUpdateVrackServicesName,
  useServiceList,
} from '@/api';
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
  const { data: vs } = useVrackService();
  const { iamResources, serviceListResponse } = useServiceList(id);

  const resource = iamResources?.data.find((r) => r.urn === urn);
  console.log({ resource });

  // const {
  //   updateVSName,
  //   isPending,
  //   error,
  //   isErrorVisible,
  // } = useUpdateVrackServicesName({
  //   onSuccess: () => {
  //     trackPage({
  //       pageType: PageType.bannerSuccess,
  //       pageName: PageName.pendingUpdateVrackServices,
  //     });
  //     navigate('..');
  //   },
  //   onError: () => {
  //     trackPage({
  //       pageType: PageType.bannerError,
  //       pageName: PageName.errorUpdateVrackServices,
  //     });
  //   },
  // });

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_endpoints', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateNameModal
      closeModal={onClose}
      inputLabel={t('updateDisplayNameInputLabel')}
      headline={t('modalUpdateHeadline')}
      // error={isErrorVisible ? error?.response?.data?.message : null}
      description={t('modalUpdateDescription')}
      // isLoading={isPending}
      defaultValue={resource?.displayName}
      updateDisplayName={(displayName) => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_endpoints', 'confirm'],
        });
        // updateVSName({ displayName, vrackServices: id });
      }}
    />
  );
}
