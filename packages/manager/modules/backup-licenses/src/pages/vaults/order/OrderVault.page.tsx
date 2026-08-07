import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { useLocations } from '@/data/hooks/useLocations/useLocations';
import { useOrderVault } from '@/data/hooks/useOrderVault/useOrderVault';
import { routeUrls } from '@/routes/routes.constants';
import {
  VAULT_ORDER_SERVER_ERROR_TYPE,
  getVaultOrderErrorMessage,
  isVaultNameRejection,
} from '@/utils/vault/vaultOrderError';

import { VaultNameField } from './_components/VaultNameField.component';
import { VaultPricingMessage } from './_components/VaultPricingMessage.component';
import { VaultRegionField } from './_components/VaultRegionField.component';
import { useVaultOrderForm } from './_hooks/useVaultOrderForm.hook';

export const VAULT_ORDER_TEST_IDS = {
  submit: 'vault-order-submit',
  cancel: 'vault-order-cancel',
  error: 'vault-order-error',
} as const;

export default function OrderVaultPage() {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.VAULTS, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { addSuccess } = useNotifications();
  const locations = useLocations();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid },
  } = useVaultOrderForm();

  const closeModal = () => navigate(routeUrls.vaults);

  const { mutate, isPending, error } = useOrderVault({
    onSuccess: () => {
      addSuccess(t('order.success'));
      closeModal();
    },
    // A refused name belongs on the field the customer has to change, not in a banner that only says
    // the order failed. Which rejections are name-scoped is decided from the status alone, because the
    // error shape R4 needs is still unpublished — see `isVaultNameRejection`.
    onError: (failure) => {
      if (isVaultNameRejection(failure)) {
        setError(
          'name',
          { type: VAULT_ORDER_SERVER_ERROR_TYPE, message: getVaultOrderErrorMessage(failure) },
          { shouldFocus: true },
        );
      }
    },
  });

  const submit = handleSubmit((values) => mutate(values));

  const channelFailure =
    error && !isVaultNameRejection(error)
      ? getVaultOrderErrorMessage(error) || t('order.error.submit_failed')
      : null;

  return (
    <Modal
      isOpen
      heading={t('order.title')}
      onDismiss={closeModal}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:order`)}
      isPrimaryButtonDisabled={!isValid || isPending}
      isPrimaryButtonLoading={isPending}
      onPrimaryButtonClick={() => void submit()}
      primaryButtonTestId={VAULT_ORDER_TEST_IDS.submit}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      secondaryButtonTestId={VAULT_ORDER_TEST_IDS.cancel}
    >
      <form
        className="flex flex-col gap-6"
        noValidate
        aria-busy={isPending}
        onSubmit={(event) => void submit(event)}
      >
        {/* Mounted from the first render and never unmounted: a live region born with its content is
            silent, so a failure appearing in a fresh node would never be announced. Out of flow while
            empty, since a zero-height flex item still claims the column's gap. */}
        <div role="alert" className={channelFailure ? undefined : 'absolute'}>
          {channelFailure && (
            <OdsMessage
              color={ODS_MESSAGE_COLOR.critical}
              isDismissible={false}
              data-testid={VAULT_ORDER_TEST_IDS.error}
            >
              {channelFailure}
            </OdsMessage>
          )}
        </div>
        <VaultNameField control={control} isDisabled={isPending} />
        <VaultRegionField control={control} isDisabled={isPending} locations={locations} />
        <VaultPricingMessage />
      </form>
    </Modal>
  );
}
