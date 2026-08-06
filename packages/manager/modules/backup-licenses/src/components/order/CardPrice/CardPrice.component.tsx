import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { IntervalUnitType, OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';
import { ShellContext, i18nextLocaleToOvh } from '@ovh-ux/manager-react-shell-client';

import { useBackupServicesCatalog } from '@/data/hooks/useBackupServicesCatalog/useBackupServicesCatalog';
import {
  BACKUP_LICENSES_NAMESPACES,
  BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE,
} from '@/module.constants';
import { formatCatalogPrice, getDefaultPricing } from '@/utils/planPricing/planPricing';

interface CardPriceProps {
  /** Plan code du catalogue Agora (cf. `LicenseCardData.planCode` / `VdpTierCardData.planCode`). */
  planCode: string;
  /** Racine i18n de la carte (`license.<i18nKey>` ou `tier.<i18nKey>`) : fournit `price_prefix`. */
  i18nBase: string;
}

/**
 * Prix mensuel d'une carte de licence (étape ① du tunnel), câblé sur le catalogue Agora
 * (BKP-1208 §Technical). Masqué silencieusement si le plan n'est pas encore au catalogue
 * (endpoint pas déployé) plutôt que de réafficher un token placeholder trompeur.
 */
export default function CardPrice({ planCode, i18nBase }: CardPriceProps) {
  const { t, i18n } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const { environment } = useContext(ShellContext);
  const { data: catalog, isLoading } = useBackupServicesCatalog();
  const pricing = getDefaultPricing(catalog, planCode);

  // Tarif du Gio au-delà des 500 Go inclus, sur le même vault que la commande ajoute au panier :
  // c'est lui que l'astérisque de la liste des prestations renvoie ici.
  const storagePricing = getDefaultPricing(catalog, BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE);
  const storageRate =
    catalog && storagePricing
      ? formatCatalogPrice(storagePricing.price, catalog.locale.currencyCode, i18n.language)
      : undefined;

  if (isLoading) {
    return <OdsSkeleton className="h-5 w-48" />;
  }

  if (!pricing) {
    return null;
  }

  return (
    <span className="flex flex-col gap-2">
      <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-600)]">
        {t(`${i18nBase}.price_prefix`)}
        <Price
          value={pricing.price}
          tax={pricing.tax}
          intervalUnit={IntervalUnitType.month}
          locale={i18nextLocaleToOvh(i18n.language)}
          ovhSubsidiary={environment.getUser().ovhSubsidiary as OvhSubsidiary}
        />{' '}
        {t('card.price_unit')}
      </OdsText>
      {storageRate && (
        <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-500)]">
          {t('card.vault_storage_note', { price: storageRate })}
        </OdsText>
      )}
    </span>
  );
}
