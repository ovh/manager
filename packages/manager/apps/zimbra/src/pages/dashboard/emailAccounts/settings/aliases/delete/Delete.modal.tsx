import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { MODAL_COLOR, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { deleteZimbraPlatformAlias, getZimbraPlatformAliasQueryKey } from '@/data/api';
import { useAlias } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EMAIL_ACCOUNT_DELETE_ALIAS } from '@/tracking.constants';

export const DeleteAlias = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common', NAMESPACES.ACTIONS]);
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
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_delete_success_message')}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EMAIL_ACCOUNT_DELETE_ALIAS,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
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
      type={MODAL_COLOR.critical}
      onOpenChange={onClose}
      open
      loading={isLoading}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        onClick: handleDeleteClick,
        loading: isDeleting,
        testId: 'delete-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
      }}
    >
      <Text preset={TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={'zimbra_account_alias_delete_modal_description'}
          values={{
            alias: alias?.currentState.alias.name,
          }}
        />
      </Text>
    </Modal>
  );
};

export default DeleteAlias;
