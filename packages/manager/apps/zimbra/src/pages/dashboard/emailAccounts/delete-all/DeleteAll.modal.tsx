import React, { useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE, ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

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
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_EMAIL_ACCOUNT } from '@/tracking.constants';

export const DeleteAllEmailAccountModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId } = useParams();
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.ACTIONS]);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirmed, seIsConfirmed] = useState<boolean>(false);
  const { selectedEmailAccounts }: { selectedEmailAccounts: Array<{ id: string; email: string }> } =
    location.state || {};

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = (clear: boolean) =>
    navigate(goBackUrl, { state: { clearSelectedEmailAccounts: clear } });

  const [step, setStep] = useState(1);

  const { mutate: deleteAllEmailAccount, isPending: isSending } = useMutation({
    mutationFn: async () => {
      await Promise.all(
        selectedEmailAccounts.map((account) => deleteZimbraPlatformAccount(platformId, account.id)),
      );
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

      onClose(true);
    },
  });

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_EMAIL_ACCOUNT, CONFIRM],
    });
    deleteAllEmailAccount();
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_EMAIL_ACCOUNT, CANCEL],
    });
    onClose(false);
  };

  return (
    <Modal
      heading={t('common:delete_email_accounts')}
      type={ODS_MODAL_COLOR.critical}
      onDismiss={() => onClose(false)}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      isPrimaryButtonLoading={step === 1 ? false : isSending}
      isPrimaryButtonDisabled={step === 2 && !isConfirmed}
      onPrimaryButtonClick={step === 1 ? () => setStep(2) : handleDeleteClick}
      primaryButtonTestId="primary-btn"
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
    >
      <>
        {step === 1 && (
          <div className="flex flex-col">
            <OdsText preset={ODS_TEXT_PRESET.paragraph} data-testid="text-step-1" className="mb-4">
              {t('zimbra_account_delete_all_modal_content_step1')}
            </OdsText>
            {selectedEmailAccounts?.map((account) => (
              <OdsText key={account.id} preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
                {account.email}
              </OdsText>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex select-none flex-col gap-6">
            <OdsText preset={ODS_TEXT_PRESET.paragraph} data-testid="text-step-2" className="mb-4">
              {t('zimbra_account_delete_all_modal_content_step2')}
            </OdsText>
            <OdsFormField className="w-full">
              <label htmlFor="confirmation-delete" slot="label">
                <Trans
                  t={t}
                  i18nKey={'zimbra_account_delete_all_confirm_label'}
                  values={{
                    label: t(`${NAMESPACES.ACTIONS}:delete`),
                  }}
                />
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                data-testid="input-delete-confirm"
                name="confirmation-delete"
                id="confirmation-delete"
                onPaste={(e) => e.preventDefault()}
                onOdsChange={(e) =>
                  seIsConfirmed(
                    String(e.target.value).toLocaleLowerCase() ===
                      t(`${NAMESPACES.ACTIONS}:delete`).toLowerCase(),
                  )
                }
              />
            </OdsFormField>
          </div>
        )}
      </>
    </Modal>
  );
};

export default DeleteAllEmailAccountModal;
