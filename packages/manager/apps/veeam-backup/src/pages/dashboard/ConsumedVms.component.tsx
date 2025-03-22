import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

import { VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import { OdsBadge, OdsText, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { useQuery } from '@tanstack/react-query';

import { useVeeamBackupConsumptionQueryOptions } from '@/data/hooks/useVeeamBackupConsumption';
import { filterConsumedVms } from './helpers';

export const ConsumedVms = ({
  backup,
  id,
}: {
  backup: VeeamBackup;
  id: string;
}): JSX.Element => {
  const { t } = useTranslation('dashboard');

  const optionsOfVeeamBackupComsumption = useVeeamBackupConsumptionQueryOptions(
    id,
  );

  const { data: consumptions, isLoading, isError, error } = useQuery({
    ...optionsOfVeeamBackupComsumption,
    select: (response) => filterConsumedVms(response?.data ?? []),
  });

  if (backup?.currentState?.vms) {
    return (
      <div className="flex flex-col">
        <OdsBadge
          label={`VMs ${backup.currentState.vms}`}
          color="information"
        />
        <OdsText>{t('consumed_vms_label')}</OdsText>
      </div>
    );
  }
  if (isLoading) {
    return (
      <>
        <OdsSkeleton />
        <OdsSkeleton />
      </>
    );
  }
  if (isError && (error as AxiosError)?.response?.status !== 404) {
    return (
      <OdsBadge
        label="-"
        data-testid="consumed-vms"
        color="information"
      ></OdsBadge>
    );
  }

  return (
    <OdsBadge
      label={`${consumptions?.length || 0} VM(s)`}
      data-testid="consumed-vms"
      color="information"
    ></OdsBadge>
  );
};
