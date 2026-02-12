import { Skeleton } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  ServiceInfoRenewModeEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { translateRenewPeriod } from '@/domain/utils/utils';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';

interface DatagridColumnRenewFrequencyProps {
  readonly serviceName: string;
}

export default function DatagridColumnRenewFrequency({
  serviceName,
}: DatagridColumnRenewFrequencyProps) {
  const { t } = useTranslation('domain');
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading) {
    return (
      <div className="w-full">
        <Skeleton />
      </div>
    );
  }

  return (
    <>
      {serviceInfo && (
        <>
          <DataGridTextCell>
            {translateRenewPeriod(
              serviceInfo?.billing?.renew?.current.period,
              t,
            )}
          </DataGridTextCell>
          {serviceInfo?.billing?.renew?.current.mode ===
            ServiceInfoRenewModeEnum.Manual && (
              <CircleQuestionTooltip
                translatedMessage={t(
                  'domain_tab_general_information_subscription_manual_renew_tooltip',
                )}
              />
            )}
        </>
      )}
    </>
  );
}
