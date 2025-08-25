import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useGenerateUrl } from '@/hooks';
import {
  CANCEL,
  CONFIRM,
  DELETE_REDIRECTION,
  EMAIL_ACCOUNT_DELETE_REDIRECTION,
} from '@/tracking.constants';

export const DeleteOrganizationModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['redirections', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  const { accountId, redirectionId } = useParams();

  const trackingName = accountId ? EMAIL_ACCOUNT_DELETE_REDIRECTION : DELETE_REDIRECTION;

  const goBackUrl = useGenerateUrl('../..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: deleteRedirection, isPending: isSending } = useMutation({
    mutationFn: (id: string) => {
      return Promise.resolve(id);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      /* queryClient.invalidateQueries({
        queryKey: getZimbraPlatformRedirectionsQueryKey(platformId),
      }); */

      onClose();
    },
  });

  const handleConfirmClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    deleteRedirection(redirectionId);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.critical}
      heading={t('common:delete_redirection')}
      isOpen
      onDismiss={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      onPrimaryButtonClick={handleConfirmClick}
      isPrimaryButtonLoading={isSending}
      primaryButtonTestId="delete-btn"
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
      secondaryButtonTestId="cancel-btn"
    >
      <>
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          className="mt-5 mb-5"
          data-testid="modal-content"
        >
          {t('zimbra_redirections_delete_modal_content')}
        </OdsText>

        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
          {t('zimbra_redirections_from')}
          {' :'}
        </OdsText>

        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
          {t('zimbra_redirections_to')}
          {' :'}
        </OdsText>
      </>
    </Modal>
  );
};

export default DeleteOrganizationModal;
