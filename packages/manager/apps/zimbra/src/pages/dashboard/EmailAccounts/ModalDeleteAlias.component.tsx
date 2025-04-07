import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useGenerateUrl } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  deleteZimbraPlatformAlias,
  getZimbraPlatformAliasQueryKey,
} from '@/api/alias';
import queryClient from '@/queryClient';
import {
  CANCEL,
  CONFIRM,
  EMAIL_ACCOUNT_DELETE_ALIAS,
} from '@/tracking.constant';

export default function ModalDeleteAlias() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common']);
  const navigate = useNavigate();
  const { platformId, aliasId } = useParams();
  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: deleteAlias, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteZimbraPlatformAlias(platformId, aliasId),
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: EMAIL_ACCOUNT_DELETE_ALIAS,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EMAIL_ACCOUNT_DELETE_ALIAS,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAliasQueryKey(platformId),
      });
      onClose();
    },
  });

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EMAIL_ACCOUNT_DELETE_ALIAS, CONFIRM],
    });
    deleteAlias();
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EMAIL_ACCOUNT_DELETE_ALIAS, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      title={t('common:delete_alias')}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isOpen
      isDismissible
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        label: t('common:delete'),
        onClick: handleDeleteClick,
        isLoading: isDeleting,
        testid: 'delete-btn',
      }}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('zimbra_account_alias_delete_modal_description')}
      </OdsText>
    </Modal>
  );
}
