import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
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
  const goBack = () => navigate(goBackUrl);

  const [step, setStep] = useState(1);
  const { data, isLoading } = useAccount({ accountId: deleteEmailAccountId });

  const { mutate: deleteEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (emailAccountId: string) => {
      return deleteZimbraPlatformAccount(platformId, emailAccountId);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAccountsQueryKey(platformId),
      });

      goBack();
    },
  });

  const handleDeleteClick = () => {
    deleteEmailAccount(deleteEmailAccountId);
  };

  return (
    <Modal
      title={t('zimbra_account_delete_modal_title')}
      color={ODS_MODAL_COLOR.critical}
      onClose={goBack}
      isDismissible={true}
      isLoading={isLoading}
      isOpen
      secondaryButton={{
        label: t('zimbra_account_delete_button_cancel'),
        action: goBack,
      }}
      primaryButton={{
        label: t('zimbra_account_delete_button_delete'),
        action: step === 1 ? () => setStep(2) : handleDeleteClick,
        isLoading: step === 1 ? false : isSending,
        variant: ODS_BUTTON_VARIANT.default,
        testid: 'primary-btn',
      }}
    >
      <>
        {step === 1 && (
          <>
            <OdsText
              preset={ODS_TEXT_PRESET.paragraph}
              data-testid="text-step-1"
            >
              {t('zimbra_account_delete_modal_content_step1')}
            </OdsText>
            <span className="mt-5">
              <span slot="start">
                <OdsText
                  preset={ODS_TEXT_PRESET.paragraph}
                  className="font-bold"
                >
                  {t('zimbra_account_delete_modal_mail_label')}
                </OdsText>
              </span>

              <span slot="main" className="ml-5">
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {data?.currentState.email}
                </OdsText>
              </span>
            </span>
          </>
        )}

        {step === 2 && (
          <>
            <OdsText
              preset={ODS_TEXT_PRESET.paragraph}
              data-testid="text-step-2"
            >
              {t('zimbra_account_delete_modal_content_step2')}
            </OdsText>
            <OdsMessage
              className="mt-4"
              isDismissible={false}
              color={ODS_MESSAGE_COLOR.warning}
            >
              <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
                {t('zimbra_account_delete_modal_warn_message')}
              </OdsText>
            </OdsMessage>
          </>
        )}
      </>
    </Modal>
  );
}
