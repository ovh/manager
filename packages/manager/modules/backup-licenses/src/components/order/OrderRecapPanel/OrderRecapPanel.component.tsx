import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import { IntervalUnitType, OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';
import { ShellContext, i18nextLocaleToOvh } from '@ovh-ux/manager-react-shell-client';

import { BackupLicensesContext, BackupLicensesScope } from '@/BackupLicenses.context';
import OrderSummaryRow from '@/components/order/OrderRecapPanel/OrderSummaryRow.component';
import { useBackupServicesCatalog } from '@/data/hooks/useBackupServicesCatalog/useBackupServicesCatalog';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { useLocationLabel } from '@/hooks/useLocationLabel/useLocationLabel';
import { BACKUP_LICENSES_NAMESPACES, LABELS } from '@/module.constants';
import { LicenseFamily, ServerVaultFormState, VdpTier } from '@/types/Order.type';
import { getDefaultPricing } from '@/utils/planPricing/planPricing';

interface OrderRecapPanelProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: ServerVaultFormState;
  onFinalize: () => void;
}

/**
 * `backup-licenses` est monté à la fois par `hpc-backup-licenses` (scope `Enterprise`) et
 * `bmc-backup-licenses` (scope `Baremetal`) : le sur-titre doit donc suivre l'univers de l'app
 * hôte plutôt que rester figé sur le libellé de la maquette (cf. API-STATUS.md, BKP-1208).
 */
const UNIVERSE_I18N_KEY: Partial<Record<BackupLicensesScope, string>> = {
  Enterprise: 'summary.universe.enterprise',
  Baremetal: 'summary.universe.baremetal',
};

/**
 * Panneau récapitulatif — colonne sticky, toujours déplié (remplace l'accordéon
 * `OrderSummary`). Les boutons « Modifier » vivent désormais sur chaque `StepComponent`
 * (visibles quand l'étape est verrouillée) : ce panneau est purement une relecture +
 * le CTA final, cf. spec §11.
 */
export default function OrderRecapPanel({ family, tier, form, onFinalize }: OrderRecapPanelProps) {
  const { t, i18n } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const { environment } = useContext(ShellContext);
  const { scope } = useContext(BackupLicensesContext);
  const universeKey = scope ? UNIVERSE_I18N_KEY[scope] : undefined;

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;
  const locationLabel = useLocationLabel(form.regionApiValue);

  const emptyLabel = t('summary.empty');
  const isVdp = family === LicenseFamily.DATA_PLATFORM;

  // Tant que le tier VDP n'est pas choisi, la carte parente n'a qu'un prix « à partir de » :
  // pas assez précis pour une estimation ferme, on laisse le champ vide plutôt que d'afficher
  // un montant qui ne correspond pas forcément au choix final.
  const selectedPlanCode = isVdp
    ? (VDP_TIER_CARDS.find((card) => card.tier === tier)?.planCode ?? null)
    : (LICENSE_CARDS.find((card) => card.family === family)?.planCode ?? null);
  const { data: catalog } = useBackupServicesCatalog();
  const pricing = selectedPlanCode
    ? getDefaultPricing(catalog, selectedPlanCode)
    : undefined;

  return (
    <OdsCard className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        {universeKey && (
          <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-500)]">
            {t(universeKey)}
          </OdsText>
        )}
        <OdsText preset={ODS_TEXT_PRESET.heading6}>{LABELS.BACKUP_LICENSES}</OdsText>
      </div>

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
          <OdsText preset={ODS_TEXT_PRESET.heading5}>
            {pricing ? (
              <Price
                value={pricing.price}
                tax={pricing.tax}
                intervalUnit={IntervalUnitType.month}
                locale={i18nextLocaleToOvh(i18n.language)}
                ovhSubsidiary={environment.getUser().ovhSubsidiary as OvhSubsidiary}
              />
            ) : (
              emptyLabel
            )}
          </OdsText>
        </div>
        {/* Jamais désactivé : un clic avec formulaire invalide révèle les erreurs et
            rouvre l'étape fautive (cf. Order.page) plutôt que de bloquer silencieusement. */}
        <OdsButton type="button" className="w-full" label={t('summary.cta')} onClick={onFinalize} />
      </div>
    </OdsCard>
  );
}
