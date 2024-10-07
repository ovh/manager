import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGenerateUrl, usePlatform } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  deleteZimbraPlatformAlias,
  getZimbraPlatformAliasQueryKey,
} from '@/api/alias';
import queryClient from '@/queryClient';

export default function ModalDeleteDomain() {
  const { t } = useTranslation('accounts/alias/delete');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const deleteAliasId = searchParams.get('deleteAliasId');

  const { platformId } = usePlatform();

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path', { editEmailAccountId });
  const goBack = () => navigate(goBackUrl);

  const { mutate: handleDeleteClick, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteZimbraPlatformAlias(platformId, deleteAliasId),
    onSuccess: () => {
      addSuccess(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_alias_delete_success_message')}
        </OsdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_alias_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OsdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAliasQueryKey(platformId),
      });
      goBack();
    },
  });

  return (
    <Modal
      title={t('zimbra_account_alias_delete_modal_title')}
      color={ODS_THEME_COLOR_INTENT.warning}
      onDismissible={goBack}
      dismissible={true}
      secondaryButton={{
        label: t('zimbra_account_alias_delete_modal_cancel_btn'),
        action: goBack,
      }}
      primaryButton={{
        label: t('zimbra_account_alias_delete_modal_delete_btn'),
        action: handleDeleteClick,
        disabled: isDeleting,
        testid: 'delete-btn',
      }}
    >
      <>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_alias_delete_modal_description')}
        </OsdsText>
      </>
    </Modal>
  );
}
