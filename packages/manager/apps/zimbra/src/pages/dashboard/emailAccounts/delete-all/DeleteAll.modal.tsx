import React, { useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  MODAL_COLOR,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
        <Text preset={TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: DELETE_EMAIL_ACCOUNT,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('common:delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
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
      type={MODAL_COLOR.critical}
      onOpenChange={() => onClose(false)}
      open
      primaryButton={{
        label: t('${NAMESPACES.ACTIONS}:delete'),
        disabled: step === 2 && !isConfirmed,
        loading: step === 1 ? false : isSending,
        onClick: step === 1 ? () => setStep(2) : handleDeleteClick,
        testId: 'primary-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
      }}
    >
      <>
        {step === 1 && (
          <div className="flex flex-col">
            <Text preset={TEXT_PRESET.paragraph} data-testid="text-step-1" className="mb-4">
              {t('zimbra_account_delete_all_modal_content_step1')}
            </Text>
            {selectedEmailAccounts?.map((account) => (
              <Text key={account.id} preset={TEXT_PRESET.paragraph} className="font-bold">
                {account.email}
              </Text>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex select-none flex-col gap-6">
            <Text preset={TEXT_PRESET.paragraph} data-testid="text-step-2" className="mb-4">
              {t('zimbra_account_delete_all_modal_content_step2')}
            </Text>
            <FormField className="w-full">
              <FormFieldLabel htmlFor="confirmation-delete" slot="label">
                <Trans
                  t={t}
                  i18nKey={'zimbra_account_delete_all_confirm_label'}
                  values={{
                    label: t(`${NAMESPACES.ACTIONS}:delete`),
                  }}
                />
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                data-testid="input-delete-confirm"
                name="confirmation-delete"
                id="confirmation-delete"
                onPaste={(e) => e.preventDefault()}
                onChange={(e) =>
                  seIsConfirmed(
                    String(e.target.value).toLocaleLowerCase() ===
                      t(`${NAMESPACES.ACTIONS}:delete`).toLowerCase(),
                  )
                }
              />
            </FormField>
          </div>
        )}
      </>
    </Modal>
  );
};

export default DeleteAllEmailAccountModal;
