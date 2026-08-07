import React, { useContext, useId } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import {
  IntervalUnitType,
  ManagerButton,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { ShellContext, i18nextLocaleToOvh } from '@ovh-ux/manager-react-shell-client';

import OrderSummaryRow from '@/components/order/OrderRecapPanel/OrderSummaryRow.component';
import { useBackupServicesCatalog } from '@/data/hooks/useBackupServicesCatalog/useBackupServicesCatalog';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { AddServerFormState } from '@/hooks/useAddServerForm/useAddServerForm';
import { BACKUP_LICENSES_IAM_RULES, BACKUP_LICENSES_NAMESPACES, LABELS } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';
import { getDefaultPricing } from '@/utils/planPricing/planPricing';

interface AddServerRecapPanelProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: AddServerFormState;
  isSubmitting: boolean;
  onFinalize: () => void;
  /** URN du tenant VSPC : accès direct par URL au tunnel, donc protégé indépendamment du CTA de la liste. */
  urn?: string;
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
  urn,
}: AddServerRecapPanelProps) {
  const { t, i18n } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const { environment } = useContext(ShellContext);
  const submitButtonId = useId();

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;

  const emptyLabel = t('summary.empty');
  const isVdp = family === LicenseFamily.DATA_PLATFORM;

  const selectedPlanCode = isVdp
    ? (VDP_TIER_CARDS.find((card) => card.tier === tier)?.planCode ?? null)
    : (LICENSE_CARDS.find((card) => card.family === family)?.planCode ?? null);
  const { data: catalog } = useBackupServicesCatalog();
  const pricing = selectedPlanCode ? getDefaultPricing(catalog, selectedPlanCode) : undefined;

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
          <OdsText
            preset={ODS_TEXT_PRESET.caption}
            className="[--ods-color-text:var(--ods-color-neutral-500)]"
          >
            {t('summary.price.label')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.heading5}>
            {pricing ? (
              <>
                <Price
                  value={pricing.price}
                  tax={pricing.tax}
                  intervalUnit={IntervalUnitType.month}
                  locale={i18nextLocaleToOvh(i18n.language)}
                  ovhSubsidiary={environment.getUser().ovhSubsidiary as OvhSubsidiary}
                />{' '}
                <span className="text-[var(--ods-color-neutral-600)]">{t('card.price_unit')}</span>
              </>
            ) : (
              emptyLabel
            )}
          </OdsText>
        </div>
        {/* Jamais désactivé pour formulaire invalide (révèle les erreurs et rouvre
            l'étape fautive, cf. AddServer.page) — seulement pendant la soumission. `ManagerButton`
            y ajoute un check IAM (`vspc/backupLicenses/edit`) : protège aussi l'accès direct par
            URL, indépendamment du CTA de la liste (cf. LinkedServersTopbar). */}
        <ManagerButton
          id={submitButtonId}
          type="button"
          className="w-full"
          data-testid="add-server-submit"
          label={t('add_server.summary.cta')}
          isDisabled={isSubmitting}
          onClick={onFinalize}
          urn={urn}
          iamActions={[BACKUP_LICENSES_IAM_RULES['vspc/backupLicenses/edit']]}
        />
      </div>
    </OdsCard>
  );
}
