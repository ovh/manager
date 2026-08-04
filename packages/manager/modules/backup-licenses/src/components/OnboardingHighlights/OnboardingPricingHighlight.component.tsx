import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { IntervalUnitType, OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';
import { ShellContext, i18nextLocaleToOvh } from '@ovh-ux/manager-react-shell-client';

import { useBackupServicesCatalog } from '@/data/hooks/useBackupServicesCatalog/useBackupServicesCatalog';
import { LICENSE_CARDS } from '@/data/licenses.data';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { getLowestPricing } from '@/utils/planPricing/planPricing';

const LICENSE_CARDS_PLAN_CODES = LICENSE_CARDS.map((card) => card.planCode);

/**
 * Prix « à partir de » de la page d'onboarding : le plus bas des deux cartes de l'étape ①
 * du tunnel (Enterprise Plus / Data Platform), câblé sur le même catalogue Agora que
 * `CardPrice` (BKP-1208). Masqué silencieusement si le catalogue ne répond pas, même logique
 * que `CardPrice`.
 */
export default function OnboardingPricingHighlight() {
  const { t, i18n } = useTranslation(BACKUP_LICENSES_NAMESPACES.ONBOARDING);
  const { environment } = useContext(ShellContext);
  const { data: catalog, isLoading } = useBackupServicesCatalog();
  const pricing = getLowestPricing(catalog, LICENSE_CARDS_PLAN_CODES);

  if (isLoading) {
    return <OdsSkeleton className="h-4 w-56 mx-auto" />;
  }

  if (!pricing) {
    return null;
  }

  return (
    <OdsText preset={ODS_TEXT_PRESET.caption} className="block text-center leading-tight">
      {t('highlights.pricing_prefix')}
      <Price
        value={pricing.price}
        tax={pricing.tax}
        intervalUnit={IntervalUnitType.month}
        locale={i18nextLocaleToOvh(i18n.language)}
        ovhSubsidiary={environment.getUser().ovhSubsidiary as OvhSubsidiary}
      />{' '}
      {t('highlights.pricing_suffix')}
    </OdsText>
  );
}
