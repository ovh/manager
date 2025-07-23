import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { deleteZimbraPlatformAccount, getZimbraPlatformListQueryKey } from '@/data/api';
import { useAccount } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_EMAIL_ACCOUNT } from '@/tracking.constants';

export const DeleteEmailAccountModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, accountId } = useParams();
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.ACTIONS]);
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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</OdsText>,
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
    onSettled: async () => {
      await queryClient.invalidateQueries({
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
      heading={t('common:delete_email_account')}
      type={ODS_MODAL_COLOR.critical}
      onDismiss={onClose}
      isLoading={isLoading}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      isPrimaryButtonLoading={step === 1 ? false : isSending}
      onPrimaryButtonClick={step === 1 ? () => setStep(2) : handleDeleteClick}
      primaryButtonTestId="primary-btn"
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
    >
      <>
        {step === 1 && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph} data-testid="text-step-1" className="mb-4">
              <Trans
                t={t}
                i18nKey={'zimbra_account_delete_modal_content_step1'}
                values={{
                  email: data?.currentState.email,
                }}
              />
            </OdsText>
          </>
        )}

        {step === 2 && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph} data-testid="text-step-2" className="mb-4">
              <Trans
                t={t}
                i18nKey={'zimbra_account_delete_modal_content_step2'}
                values={{
                  email: data?.currentState.email,
                }}
              />
            </OdsText>
            <OdsMessage className="mt-4" isDismissible={false} color={ODS_MESSAGE_COLOR.warning}>
              <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
                {t('zimbra_account_delete_modal_warn_message')}
              </OdsText>
            </OdsMessage>
          </>
        )}
      </>
    </Modal>
  );
};

export default DeleteEmailAccountModal;
