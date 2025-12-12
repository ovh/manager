import {
  Icon,
  ICON_NAME,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  ServiceInfoRenewModeEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface DatagridColumnRenewFrequencyProps {
  serviceName: string;
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
    return <Skeleton />;
  }

  const translateRenewPeriod = (renewPeriod: string) => {
    if (renewPeriod) {
      const matches = renewPeriod.match(/P(\d+)Y/);
      if (matches && matches.length > 1) {
        if (matches[1] === '1') {
          return t(
            'domain_tab_general_information_subscription_renew_frequency_year',
          );
        }
        return t(
          'domain_tab_general_information_subscription_renew_frequency_years',
          { years: matches[1] },
        );
      }
    }
    return t(
      'domain_tab_general_information_subscription_renew_frequency_none',
    );
  };
  return (
    <>
      {serviceInfo && (
        <>
          <DataGridTextCell>
            {translateRenewPeriod(serviceInfo.billing?.renew?.current.period)}
          </DataGridTextCell>
          {serviceInfo.billing?.renew?.current.mode ===
            ServiceInfoRenewModeEnum.Manual && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  className="text-[--ods-color-primary-500] pl-3"
                  name={ICON_NAME.circleQuestion}
                />
              </TooltipTrigger>
              <TooltipContent>
                {t(
                  'domain_tab_general_information_subscription_manual_renew_tooltip',
                )}
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </>
  );
}
