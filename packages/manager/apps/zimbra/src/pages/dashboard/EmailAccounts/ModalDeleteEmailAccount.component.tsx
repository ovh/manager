import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useAccount, useGenerateUrl } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import { deleteZimbraPlatformAccount } from '@/api/account';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_EMAIL_ACCOUNT } from '@/tracking.constant';
import { getZimbraPlatformListQueryKey } from '@/api/platform';

export default function ModalDeleteEmailAccount() {
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, accountId } = useParams();
  const { t } = useTranslation(['accounts', 'common']);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();

  const goBackUrl = useGenerateUrl('../..', 'path');
  const onClose = () => navigate(goBackUrl);

  const [step, setStep] = useState(1);
  const { data, isLoading } = useAccount({ accountId });

  const { mutate: deleteEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (emailAccountId: string) => {
      return deleteZimbraPlatformAccount(platformId, emailAccountId);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: DELETE_EMAIL_ACCOUNT,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: DELETE_EMAIL_ACCOUNT,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformListQueryKey(),
      });

      onClose();
    },
  });

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_EMAIL_ACCOUNT, CONFIRM],
    });
    deleteEmailAccount(accountId);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_EMAIL_ACCOUNT, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      title={t('common:delete_email_account')}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isLoading={isLoading}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        label: t('common:delete'),
        onClick: step === 1 ? () => setStep(2) : handleDeleteClick,
        isLoading: step === 1 ? false : isSending,
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
                  {t('common:email_account')}
                  {' :'}
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
