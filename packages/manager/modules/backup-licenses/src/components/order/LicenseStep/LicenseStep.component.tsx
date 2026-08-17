import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import LicenseTypeCard from '@/components/order/LicenseTypeCard/LicenseTypeCard.component';
import VdpTierCard from '@/components/order/VdpTierCard/VdpTierCard.component';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

interface LicenseStepProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  onSelectFamily: (family: LicenseFamily) => void;
  onSelectTier: (tier: VdpTier) => void;
  /** Cartes de famille non sélectionnables (tunnel d'édition, cf. `licenseEditRules`). */
  familyDisabled?: boolean;
  /** Cartes de niveau VDP non sélectionnables (tunnel d'édition, cf. `licenseEditRules`). */
  tierDisabled?: boolean;
}

/**
 * Étape ① — type de licence (2 cartes). Choisir Data Platform dévoile, dans la même
 * étape, les 3 cartes de niveau VDP : un palier est un affinage du choix de famille,
 * pas une décision de même rang (cf. spec §14) — le stepper ne compte donc que 3 étapes.
 */
export default function LicenseStep({
  family,
  tier,
  onSelectFamily,
  onSelectTier,
  familyDisabled = false,
  tierDisabled = false,
}: LicenseStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const isDataPlatform = family === LicenseFamily.DATA_PLATFORM;

  return (
    <section>
      <div
        role="radiogroup"
        aria-label={t('step.license_type.label')}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {LICENSE_CARDS.map((card) => (
          <LicenseTypeCard
            key={card.family}
            card={card}
            selected={family === card.family}
            disabled={familyDisabled}
            onSelect={() => onSelectFamily(card.family)}
          />
        ))}
      </div>

      {isDataPlatform && (
        <div className="mt-9">
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="mb-2 block">
            {t('step.vdp_tier.label')}
          </OdsText>
          <OdsText
            preset={ODS_TEXT_PRESET.paragraph}
            className="mb-8 block text-[var(--ods-color-neutral-600)]"
          >
            {t('step.vdp_tier.subtitle')}
          </OdsText>
          <div
            role="radiogroup"
            aria-label={t('step.vdp_tier.label')}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {VDP_TIER_CARDS.map((card) => (
              <VdpTierCard
                key={card.tier}
                card={card}
                selected={tier === card.tier}
                disabled={tierDisabled}
                onSelect={() => onSelectTier(card.tier)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
