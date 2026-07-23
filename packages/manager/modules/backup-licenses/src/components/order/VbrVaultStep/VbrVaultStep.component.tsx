import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import OrderTextField from '@/components/order/OrderTextField/OrderTextField.component';
import RegionSelector from '@/components/order/RegionSelector/RegionSelector.component';
import VaultInfoPanel from '@/components/order/VaultInfoPanel/VaultInfoPanel.component';
import VbrServerFields from '@/components/order/VbrServerFields/VbrServerFields.component';
import { OrderFieldErrors, OrderFieldName } from '@/hooks/useOrderForm/useOrderForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { ServerVaultFormState } from '@/types/Order.type';

interface VbrVaultStepProps {
  form: ServerVaultFormState;
  errors: OrderFieldErrors;
  onFieldChange: (key: OrderFieldName, value: string) => void;
  onFieldBlur: (field: OrderFieldName) => void;
  onToggleNat: (checked: boolean) => void;
  onSelectRegion: (apiValue: string) => void;
}

/** Étape 3 — configuration serveur VBR, Vault (encart + nom) et localisation. */
export default function VbrVaultStep({
  form,
  errors,
  onFieldChange,
  onFieldBlur,
  onToggleNat,
  onSelectRegion,
}: VbrVaultStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <section className="flex flex-col gap-9">
      <VbrServerFields
        form={form}
        errors={errors}
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
          <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-600)]">
            {t('vault.section_subtitle')}
          </OdsText>
        </div>
        <VaultInfoPanel />
        <OrderTextField
          id="vault-display-name"
          label={t('field.vault_name.label')}
          value={form.vaultDisplayName}
          placeholder={t('field.vault_name.placeholder')}
          hint={t('field.vault_name.hint')}
          error={errors.vaultDisplayName ? t(errors.vaultDisplayName) : null}
          required
          onChange={(value) => onFieldChange('vaultDisplayName', value)}
          onBlur={() => onFieldBlur('vaultDisplayName')}
        />
      </div>

      <OdsDivider />

      <RegionSelector selected={form.regionApiValue} onSelect={onSelectRegion} />
    </section>
  );
}
