import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';
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
  const { organisationId } = params;
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
      onOpenChange={closeHandler}
      heading={t('manageOrganisationsDelete_confirm_headline')}
      primaryButton={{
        label: t('delete', { ns: NAMESPACES.ACTIONS }),
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['delete_organization', 'confirm'],
          });
          deleteManagerOrganisation();
        },
        loading: isPending,
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        disabled: isPending,
        onClick: closeHandler,
      }}
    />
  );
}
