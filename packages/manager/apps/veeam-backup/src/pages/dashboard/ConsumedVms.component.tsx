import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

import { VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import { OsdsChip } from '@ovhcloud/ods-components/react';

import { Description } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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

  return (
    <Fragment>
      {backup?.currentState?.vms ? (
        <div className="flex flex-col">
          <OsdsChip color={ODS_THEME_COLOR_INTENT.primary} inline>
            {backup.currentState.vms} VMs
          </OsdsChip>
          <Description>{t('consumed_vms_label')}</Description>
        </div>
      ) : (
        <OsdsChip
          data-testid="consumed-vms"
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
        >
          {(() => {
            if (
              isLoading ||
              (isError && (error as AxiosError)?.response?.status !== 404)
            ) {
              return '-';
            }
            return `${consumptions?.length || 0} VM(s)`;
          })()}
        </OsdsChip>
      )}
    </Fragment>
  );
};
