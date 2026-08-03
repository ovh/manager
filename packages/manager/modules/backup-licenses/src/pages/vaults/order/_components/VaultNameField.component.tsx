import React from 'react';

import { Control, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import OrderTextField from '@/components/order/OrderTextField/OrderTextField.component';
import { VAULT_ORDER_SERVER_ERROR_TYPE } from '@/utils/vault/vaultOrderError';

import { VaultOrderFormValues } from '../_hooks/useVaultOrderForm.hook';

export const VAULT_ORDER_NAME_FIELD_ID = 'vault-order-name';

export const VaultNameField = ({
  control,
  isDisabled,
}: {
  control: Control<VaultOrderFormValues>;
  isDisabled?: boolean;
}) => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);
  const {
    field: { ref: registerControl, ...field },
    fieldState: { error },
  } = useController({ control, name: 'name' });

  // The schema yields i18n keys; a rejection from the API yields a sentence, which must not go through
  // `t()` — its own punctuation would be read as i18next's namespace and key separators.
  const errorText =
    error?.type === VAULT_ORDER_SERVER_ERROR_TYPE
      ? error.message
      : error?.message && t(error.message);

  return (
    <OrderTextField
      // La ref permet à RHF de donner le focus au champ en erreur après un submit invalide.
      ref={registerControl}
      id={VAULT_ORDER_NAME_FIELD_ID}
      label={t('order.field.name.label')}
      hint={t('order.field.name.hint')}
      value={field.value}
      required
      isDisabled={isDisabled}
      error={errorText ?? null}
      onChange={(value) => field.onChange(value)}
      onBlur={field.onBlur}
    />
  );
};
