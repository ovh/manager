import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useGetServiceConsumptionOptions } from '@/data/hooks/consumption/useServiceConsumption';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { VAULT_PLAN_CODE } from '@/module.constants';

import { CONSUMPTION_MAX_VALUE_IN_TB } from '../SubscriptionTile.component';

export const BillingType = () => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD, NAMESPACES.BYTES]);
  const { vaultId } = useRequiredParams('vaultId');
  const { data: consumptionData, isPending } = useQuery(useGetServiceConsumptionOptions()(vaultId));

  const bundleSize = `${CONSUMPTION_MAX_VALUE_IN_TB}${t(`${NAMESPACES.BYTES}:unit_size_TB`)}`;
  const priceTTCText =
    consumptionData?.find((consumption) => consumption.planCode === VAULT_PLAN_CODE)?.price.text ??
    '-';

  return (
    <div>
      <OdsText class="block">Bundle - {bundleSize}</OdsText>

      {isPending ? (
        <OdsSkeleton />
      ) : (
        <OdsText
          className="block [&::part(text)]:font-bold [&::part(text)]:text-[var(--ods-color-primary-500)]"
          color="primary"
        >
          {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:vault_price`, {
            vaultPrice: priceTTCText,
          })}
        </OdsText>
      )}
      <OdsText className="block [&::part(text)]:font-light">
        {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:without_engagement`)}
      </OdsText>
    </div>
  );
};
