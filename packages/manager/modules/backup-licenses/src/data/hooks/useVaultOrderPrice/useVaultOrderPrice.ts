import { useTranslation } from 'react-i18next';

import { useBackupServicesCatalog } from '@/data/hooks/useBackupServicesCatalog/useBackupServicesCatalog';
import { BACKUP_LICENSES_VAULT_PAYGO_CONSUMPTION_PLAN_CODE } from '@/module.constants';
import { formatCatalogPrice, getDefaultPricing } from '@/utils/planPricing/planPricing';

export const useVaultOrderPrice = (): {
  priceText?: string;
  isPending: boolean;
} => {
  const { i18n } = useTranslation();
  const { data: catalog, isPending } = useBackupServicesCatalog();

  const pricing = getDefaultPricing(catalog, BACKUP_LICENSES_VAULT_PAYGO_CONSUMPTION_PLAN_CODE);
  const priceText =
    catalog && pricing
      ? formatCatalogPrice(pricing.price, catalog.locale.currencyCode, i18n.language)
      : undefined;

  return { priceText, isPending };
};
