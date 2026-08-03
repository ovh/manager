import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import OrderSummaryRow from '@/components/order/OrderRecapPanel/OrderSummaryRow.component';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { AddServerFormState } from '@/hooks/useAddServerForm/useAddServerForm';
import { BACKUP_LICENSES_NAMESPACES, LABELS } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

interface AddServerRecapPanelProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: AddServerFormState;
  isSubmitting: boolean;
  onFinalize: () => void;
}

/**
 * Panneau récapitulatif de l'ajout de serveur (BKP-1217) — variante réduite de
 * OrderRecapPanel : pas de ligne vault/région, le vault existe déjà.
 */
export default function AddServerRecapPanel({
  family,
  tier,
  form,
  isSubmitting,
  onFinalize,
}: AddServerRecapPanelProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;

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
          label={t('add_server.summary.field.server_name')}
          value={form.displayName}
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
        {/* Jamais désactivé pour formulaire invalide (révèle les erreurs et rouvre
            l'étape fautive, cf. AddServer.page) — seulement pendant la soumission. */}
        <OdsButton
          type="button"
          className="w-full"
          label={t('add_server.summary.cta')}
          isDisabled={isSubmitting}
          onClick={onFinalize}
        />
      </div>
    </OdsCard>
  );
}
