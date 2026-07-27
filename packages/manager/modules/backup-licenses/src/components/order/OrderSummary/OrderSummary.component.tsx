import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsAccordion, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import OrderSummaryRow from '@/components/order/OrderSummary/OrderSummaryRow.component';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { VAULT_REGIONS } from '@/data/regions.data';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import {
  LicenseFamily,
  OrderStepId,
  ServerVaultFormState,
  VdpTier,
} from '@/types/Order.type';

interface OrderSummaryProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: ServerVaultFormState;
  /** Retour à l'étape « type de licence » pour changer d'offre (contrôle utilisateur). */
  onEdit: (step: OrderStepId) => void;
}

/**
 * Récapitulatif de commande, en accordéon replié par défaut, placé en pied de la
 * dernière étape. Il rappelle l'offre (licence, niveau, stockage inclus) ET les deux
 * choix irréversibles de configuration — nom du Vault et localisation — pour que
 * l'utilisateur les relise avant de s'engager (reconnaissance plutôt que rappel).
 * L'estimation de prix est visible dès l'en-tête ; le détail s'ouvre à la demande.
 *
 * `order__accordion` donne la bordure permanente, qu'ODS ne montre qu'au survol. La classe
 * vit dans l'`index.scss` de l'app : `::part` n'est pas exprimable en classes utilitaires.
 */
export default function OrderSummary({
  family,
  tier,
  form,
  onEdit,
}: OrderSummaryProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  const familyKey =
    LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey =
    VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;
  const regionKey =
    VAULT_REGIONS.find((region) => region.apiValue === form.regionApiValue)
      ?.i18nKey ?? null;

  const emptyLabel = t('summary.empty');
  const isVdp = family === LicenseFamily.DATA_PLATFORM;

  return (
    <OdsAccordion className="order__accordion mt-10 block">
      <OdsText preset={ODS_TEXT_PRESET.heading6} slot="summary">
        {t('summary.title')}
      </OdsText>

      {/* Pas de padding ici : `::part(content)` d'ODS le fournit déjà. */}
      <div>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => onEdit(OrderStepId.LICENSE_TYPE)}
            className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-xs font-medium text-[var(--ods-color-primary-500)] hover:underline"
          >
            <OdsIcon name={ODS_ICON_NAME.pen} aria-hidden="true" />
            {t('summary.edit')}
          </button>
        </div>

        <div className="flex flex-col gap-2">
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
            value={regionKey ? t(`region.${regionKey}.name`) : null}
            emptyLabel={emptyLabel}
          />
        </div>
      </div>
    </OdsAccordion>
  );
}
