import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { consumptionQueries } from '@/data/queries/consumption.queries';
import { selectConsumptionPriceText } from '@/data/selectors/consumption.selectors';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { getTaxExcludedLabel } from '@/utils/getTaxExcludedLabel';

import { CONSUMPTION_MAX_VALUE_IN_TB } from '../SubscriptionTile.component';

const PAY_AS_TO_GO_LABEL = 'Pay as you go';

export const BillingType = () => {
  const { t, i18n } = useTranslation([
    BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD,
    NAMESPACES.BYTES,
    BACKUP_AGENT_NAMESPACES.COMMON,
  ]);
  const { vaultId } = useRequiredParams('vaultId');
  const taxLabel = getTaxExcludedLabel(i18n.language, useEnvironment().getUser?.()?.ovhSubsidiary);
  const queryClient = useQueryClient();
  const { data: priceHTText = '-', isPending } = useQuery({
    ...consumptionQueries.withClient(queryClient).byResource(vaultId),
    select: selectConsumptionPriceText,
  });

  const bundleSize = `${CONSUMPTION_MAX_VALUE_IN_TB}${t(`${NAMESPACES.BYTES}:unit_size_TB`)}`;

  return (
    <div>
      <OdsText class="block">
        {PAY_AS_TO_GO_LABEL} - {bundleSize}
      </OdsText>

      {isPending ? (
        <OdsSkeleton />
      ) : (
        <OdsText
          className="block [&::part(text)]:font-bold [&::part(text)]:text-[var(--ods-color-primary-500)]"
          color="primary"
        >
          {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:vault_price`, {
            vaultPrice: priceHTText,
            taxLabel,
          })}
        </OdsText>
      )}
      <OdsText className="block [&::part(text)]:font-light">
        {t(`${BACKUP_AGENT_NAMESPACES.COMMON}:without_engagement`)}
      </OdsText>
    </div>
  );
};
