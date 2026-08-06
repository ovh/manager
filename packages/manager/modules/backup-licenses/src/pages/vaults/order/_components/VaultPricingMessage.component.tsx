import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { useVaultOrderPrice } from '@/data/hooks/useVaultOrderPrice/useVaultOrderPrice';

export const VAULT_ORDER_PRICING_TEST_IDS = {
  message: 'vault-order-pricing',
  skeleton: 'vault-order-pricing-skeleton',
} as const;

/**
 * The pay-as-you-go rate BKP-1223 requires the modal to state, served by Agora and never written
 * here (R1). With no rate it is the whole sentence that goes, not just the figure: a sentence
 * stripped of its number would announce a billing model without saying which. Same degradation as
 * `CardPrice` in the order funnel — skeleton, then nothing.
 */
export function VaultPricingMessage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);
  const { priceText, isPending } = useVaultOrderPrice();

  if (isPending) {
    return <OdsSkeleton className="h-5" data-testid={VAULT_ORDER_PRICING_TEST_IDS.skeleton} />;
  }

  if (!priceText) {
    return null;
  }

  return (
    <OdsMessage
      color={ODS_MESSAGE_COLOR.information}
      isDismissible={false}
      data-testid={VAULT_ORDER_PRICING_TEST_IDS.message}
    >
      {t('order.pricing_message', { price: priceText })}
    </OdsMessage>
  );
}
