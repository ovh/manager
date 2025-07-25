import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGenerateUrl } from '@/hooks';
import {
  deleteZimbraPlatformAlias,
  getZimbraPlatformAliasQueryKey,
} from '@/data/api';
import queryClient from '@/queryClient';
import {
  CANCEL,
  CONFIRM,
  EMAIL_ACCOUNT_DELETE_ALIAS,
} from '@/tracking.constants';
import { useAlias } from '@/data/hooks';

export const DeleteAlias = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation([
    'accounts/alias',
    'common',
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();
  const { platformId, aliasId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const { data: alias, isLoading } = useAlias();

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
      heading={t('common:delete_alias')}
      type={ODS_MODAL_COLOR.critical}
      onDismiss={onClose}
      isOpen
      isLoading={isLoading}
      primaryLabel={t('common:delete')}
      onPrimaryButtonClick={handleDeleteClick}
      isPrimaryButtonLoading={isDeleting}
      primaryButtonTestId="delete-btn"
      secondaryLabel={t('common:cancel')}
      onSecondaryButtonClick={handleCancelClick}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={'zimbra_account_alias_delete_modal_description'}
          values={{
            alias: alias?.currentState.alias.name,
          }}
        />
      </OdsText>
    </Modal>
  );
};

export default DeleteAlias;
