import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import OrderSummaryRow from '@/components/order/OrderRecapPanel/OrderSummaryRow.component';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { useLocationLabel } from '@/hooks/useLocationLabel/useLocationLabel';
import { BACKUP_LICENSES_NAMESPACES, LABELS } from '@/module.constants';
import { LicenseFamily, ServerVaultFormState, VdpTier } from '@/types/Order.type';

interface OrderRecapPanelProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: ServerVaultFormState;
  onFinalize: () => void;
}

/**
 * Panneau récapitulatif — colonne sticky, toujours déplié (remplace l'accordéon
 * `OrderSummary`). Les boutons « Modifier » vivent désormais sur chaque `StepComponent`
 * (visibles quand l'étape est verrouillée) : ce panneau est purement une relecture +
 * le CTA final, cf. spec §11.
 */
export default function OrderRecapPanel({ family, tier, form, onFinalize }: OrderRecapPanelProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;
  const locationLabel = useLocationLabel(form.regionApiValue);

  const emptyLabel = t('summary.empty');
  const isVdp = family === LicenseFamily.DATA_PLATFORM;

  return (
    <OdsCard className="flex flex-col gap-6 p-6">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>{LABELS.BACKUP_LICENSES}</OdsText>

      <OdsDivider className="m-0" />

      <div className="flex flex-col gap-3">
        <OrderSummaryRow
          label={t('summary.field.family')}
          value={familyKey ? t(`license.${familyKey}.title`) : null}
          emptyLabel={emptyLabel}
        />
        {isVdp && (
          <OrderSummaryRow
            label={t('summary.field.tier')}
            value={tierKey ? t(`tier.${tierKey}.title`) : null}
            emptyLabel={emptyLabel}
          />
        )}
        <OrderSummaryRow
          label={t('summary.field.vault_included')}
          value={t('summary.vault_included_value')}
          emptyLabel={emptyLabel}
        />
        <OrderSummaryRow
          label={t('summary.field.vault_name')}
          value={form.vaultDisplayName}
          emptyLabel={emptyLabel}
        />
        <OrderSummaryRow
          label={t('summary.field.region')}
          value={locationLabel || null}
          emptyLabel={emptyLabel}
        />
      </div>

      <OdsDivider className="m-0" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-500)]">
            {t('summary.price.label')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.heading5}>{t('summary.price.value')}</OdsText>
        </div>
        {/* Jamais désactivé : un clic avec formulaire invalide révèle les erreurs et
            rouvre l'étape fautive (cf. Order.page) plutôt que de bloquer silencieusement. */}
        <OdsButton type="button" className="w-full" label={t('summary.cta')} onClick={onFinalize} />
      </div>
    </OdsCard>
  );
}
