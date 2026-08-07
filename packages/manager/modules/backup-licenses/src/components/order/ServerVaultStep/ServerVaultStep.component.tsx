import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import OrderTextField from '@/components/order/OrderTextField/OrderTextField.component';
import VaultIncludedCard from '@/components/order/VaultIncludedCard/VaultIncludedCard.component';
import VbrServerFields from '@/components/order/VbrServerFields/VbrServerFields.component';
import { OrderFieldErrors, OrderFieldName } from '@/hooks/useOrderForm/useOrderForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { ServerVaultFormState } from '@/types/Order.type';

interface ServerVaultStepProps {
  form: ServerVaultFormState;
  errors: OrderFieldErrors;
  isDisabled?: boolean;
  onFieldChange: (key: OrderFieldName, value: string) => void;
  onFieldBlur: (field: OrderFieldName) => void;
  onToggleNat: (checked: boolean) => void;
}

/** Étape ② — configuration du serveur VBR et du Vault (nom + carte « Inclus »). */
export default function ServerVaultStep({
  form,
  errors,
  isDisabled = false,
  onFieldChange,
  onFieldBlur,
  onToggleNat,
}: ServerVaultStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <section className="flex flex-col gap-9">
      <VbrServerFields
        form={form}
        errors={errors}
        isDisabled={isDisabled}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        onToggleNat={onToggleNat}
      />

      <OdsDivider />

      <div className="flex flex-col gap-6">
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading5} className="block">
            {t('vault.section_title')}
          </OdsText>
          <OdsText
            preset={ODS_TEXT_PRESET.caption}
            className="[--ods-color-text:var(--ods-color-neutral-600)]"
          >
            {t('vault.section_subtitle')}
          </OdsText>
        </div>
        <VaultIncludedCard />
        <OrderTextField
          id="vault-display-name"
          label={t('field.vault_name.label')}
          value={form.vaultDisplayName}
          placeholder={t('field.vault_name.placeholder')}
          hint={t('field.vault_name.hint')}
          error={errors.vaultDisplayName ? t(errors.vaultDisplayName) : null}
          required
          isDisabled={isDisabled}
          onChange={(value) => onFieldChange('vaultDisplayName', value)}
          onBlur={() => onFieldBlur('vaultDisplayName')}
        />
      </div>
    </section>
  );
}
