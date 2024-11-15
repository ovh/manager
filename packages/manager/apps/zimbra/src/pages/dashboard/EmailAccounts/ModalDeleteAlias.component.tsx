import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
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
  const deleteAliasId = searchParams.get('deleteAliasId');
  const params = Object.fromEntries(searchParams.entries());
  delete params.deleteAliasId;

  const { platformId } = usePlatform();

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path', params);
  const goBack = () => navigate(goBackUrl);

  const { mutate: handleDeleteClick, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteZimbraPlatformAlias(platformId, deleteAliasId),
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
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
      goBack();
    },
  });

  return (
    <Modal
      title={t('zimbra_account_alias_delete_modal_title')}
      color={ODS_MODAL_COLOR.critical}
      onClose={goBack}
      isOpen
      isDismissible
      secondaryButton={{
        label: t('zimbra_account_alias_delete_modal_cancel_btn'),
        action: goBack,
      }}
      primaryButton={{
        label: t('zimbra_account_alias_delete_modal_delete_btn'),
        action: handleDeleteClick,
        variant: ODS_BUTTON_VARIANT.default,
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
