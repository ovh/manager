import {
  Icon,
  ICON_NAME,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useGetServiceInformation } from '@/domain/hooks/data/query';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface DatagridColumnRenewFrequencyProps {
  serviceName: string;
}

export default function DatagridColumnRenewFrequency({
  serviceName,
}: DatagridColumnRenewFrequencyProps) {
  const { t } = useTranslation('domain');
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading) {
    return <Skeleton />;
  }

  const translateRenewPeriod = (renewPeriod: string) => {
    if (renewPeriod) {
      const matches = renewPeriod.match(/P(\d)Y/);
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
          {translateRenewPeriod(serviceInfo.billing?.renew?.current.period)}
          {serviceInfo.billing?.renew?.current.mode ===
            ServiceInfoRenewModeEnum.Manual && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
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
