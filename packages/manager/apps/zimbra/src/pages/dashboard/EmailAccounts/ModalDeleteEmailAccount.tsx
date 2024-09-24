import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OsdsContentAddon,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useAccount, useGenerateUrl, usePlatform } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  deleteZimbraPlatformAccount,
  getZimbraPlatformAccountsQueryKey,
} from '@/api/account';
import queryClient from '@/queryClient';

export default function ModalDeleteEmailAccount() {
  const [searchParams] = useSearchParams();
  const deleteEmailAccountId = searchParams.get('deleteEmailAccountId');
  const { t } = useTranslation('accounts/delete');
  const { platformId } = usePlatform();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const [step, setStep] = useState(1);
  const { data, isLoading } = useAccount(deleteEmailAccountId);

  const { mutate: deleteEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (emailAccountId: string) => {
      return deleteZimbraPlatformAccount(platformId, emailAccountId);
    },
    onSuccess: () => {
      addSuccess(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_delete_success_message')}
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
          {t('zimbra_account_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OsdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAccountsQueryKey(platformId),
      });

      onClose();
    },
  });

  const handleDeleteClick = () => {
    deleteEmailAccount(deleteEmailAccountId);
  };

  return (
    <Modal
      title={t('zimbra_account_delete_modal_title')}
      color={ODS_THEME_COLOR_INTENT.warning}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      secondaryButton={{
        label: t('zimbra_account_delete_button_cancel'),
        action: onClose,
      }}
      primaryButton={{
        label: t('zimbra_account_delete_button_delete'),
        action: step === 1 ? () => setStep(2) : handleDeleteClick,
        disabled: step === 1 ? false : isSending,
        testid: 'primary-btn',
      }}
    >
      <>
        {step === 1 && (
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
              data-testid="text-step-1"
            >
              {t('zimbra_account_delete_modal_content_step1')}
            </OsdsText>
            <OsdsContentAddon className="mt-5">
              <span slot="start">
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  hue={ODS_THEME_COLOR_HUE._500}
                >
                  {t('zimbra_account_delete_modal_mail_label')}
                </OsdsText>
              </span>

              <span slot="main" className="ml-5">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  hue={ODS_THEME_COLOR_HUE._500}
                >
                  {data?.currentState.email}
                </OsdsText>
              </span>
            </OsdsContentAddon>
          </>
        )}

        {step === 2 && (
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
              data-testid="text-step-2"
            >
              {t('zimbra_account_delete_modal_content_step2')}
            </OsdsText>
            <OsdsMessage
              color={ODS_THEME_COLOR_INTENT.warning}
              icon={ODS_ICON_NAME.WARNING_CIRCLE}
              className="mt-4"
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                {t('zimbra_account_delete_modal_warn_message')}
              </OsdsText>
            </OsdsMessage>
          </>
        )}
      </>
    </Modal>
  );
}
