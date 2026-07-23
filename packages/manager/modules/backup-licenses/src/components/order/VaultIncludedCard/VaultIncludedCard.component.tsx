import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsCheckbox, OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

const CHECKBOX_ID = 'vault-included-checkbox';

/**
 * Carte Vault de l'étape ② — cochée en permanence, non décochable : le Vault est
 * inclus d'office avec toute licence, ce n'est pas une option à choisir (remplace
 * l'accordéon dépliable `VaultInfoPanel`, cf. spec §9).
 */
export default function VaultIncludedCard() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <div className="flex items-start gap-4 rounded-lg border border-[var(--ods-color-neutral-200)] bg-[var(--ods-color-neutral-050)] p-6">
      <OdsCheckbox inputId={CHECKBOX_ID} name={CHECKBOX_ID} isChecked isDisabled />
      <label htmlFor={CHECKBOX_ID} className="flex flex-1 flex-col gap-2">
        <span className="flex items-center gap-3">
          <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-semibold">
            {t('vault.included_label')}
          </OdsText>
          <OdsBadge
            label={t('vault.included_badge')}
            color={ODS_BADGE_COLOR.success}
            size={ODS_BADGE_SIZE.sm}
          />
        </span>
        <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-600)]">
          {t('vault.included_description')}
        </OdsText>
      </label>
    </div>
  );
}
