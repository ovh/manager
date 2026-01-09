import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  deleteOrganisation,
  getOrganisationListQueryKey,
  getOrganisationsDetailsQueryKey,
} from '@/data/api';

export default function DeleteOrganisation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ organisationId: string }>();
  const organisationId = params.organisationId;
  const { t } = useTranslation(['manage-organisations', NAMESPACES.ACTIONS]);
  const { clearNotifications, addSuccess, addError } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: getOrganisationListQueryKey(),
    });
    await queryClient.invalidateQueries({
      queryKey: getOrganisationsDetailsQueryKey({ organisationId }),
    });

    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: 'delete_organization_success',
    });
    clearNotifications();
    addSuccess(t('manageOrganisationsDelete_success', { organisationId }));
    closeModal();
  };

  const onError = (e: ApiError) => {
    clearNotifications();
    const responseErrorMessage = e.response?.data.message ?? e.message;
    const displayedErrorMessage = responseErrorMessage.includes(
      'still used on IP blocks',
    )
      ? t('manageOrganisationsDelete_includedInIpBlock_error')
      : t('manageOrganisationsDelete_unknown_error', {
          error: responseErrorMessage,
        });
    addError(displayedErrorMessage);
    trackPage({
      pageType: PageType.bannerError,
      pageName: 'delete_organization_error',
    });
    closeModal();
  };

  const closeHandler = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_organization', 'cancel'],
    });
    closeModal();
  };

  const { mutate: deleteManagerOrganisation, isPending } = useMutation({
    mutationFn: () => deleteOrganisation(organisationId),
    onSuccess,
    onError,
  });

  return (
    <Modal
      isOpen
      onDismiss={closeHandler}
      heading={t('manageOrganisationsDelete_confirm_headline')}
      primaryLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_organization', 'confirm'],
        });
        deleteManagerOrganisation();
      }}
      isPrimaryButtonLoading={isPending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      isSecondaryButtonDisabled={isPending}
      onSecondaryButtonClick={closeHandler}
    ></Modal>
  );
}
