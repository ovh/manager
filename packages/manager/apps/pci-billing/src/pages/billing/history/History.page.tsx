import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsSpinner,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import {
  useGetUsageHistory,
  useUsageHistoryPeriod,
} from '@/api/hook/useHistory';
import HourlyConsumption from '@/components/consumption/HourlyConsumption.component';
import MonthlyConsumption from '@/components/consumption/MonthlyConsumption.component';
import HistoryHeader from '@/components/history/HistoryHeader.component';
import HistoryResume from '@/components/history/HistoryResume.component';
import { useComputeDate } from '@/components/history/useComputeDate.hook';
import { PCI_FEATURES_BILLING_POST_PAID, TRUSTED_ZONE } from '@/constants';

export default function History() {
  const { t } = useTranslation('history');

  const { projectId } = useParams();
  const { billingDate, prevMonthDate, translationValues } = useComputeDate();

  const { data: historyPeriods } = useUsageHistoryPeriod(
    projectId,
    format(prevMonthDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    format(billingDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  );

  const { data: consumption, isPending } = useGetUsageHistory(
    projectId,
    historyPeriods,
  );

  const { data: availability } = useFeatureAvailability([
    PCI_FEATURES_BILLING_POST_PAID,
    TRUSTED_ZONE,
  ]);

  const isTrustedZone = availability && availability[TRUSTED_ZONE];
  const isPostPaidUsageBilling =
    availability && availability[PCI_FEATURES_BILLING_POST_PAID];

  return (
    <div>
      <HistoryHeader />
      <>
        {isPending ? (
          <OsdsSpinner
            className="block text-center"
            inline
            size={ODS_SPINNER_SIZE.md}
          />
        ) : (
          <>
            <HistoryResume
              totalPrice={consumption?.totals.total}
              isPostPaidUsageBilling={isPostPaidUsageBilling}
            />

            <div className="flex items-start flex-col xl:flex-row gap-7">
              <OsdsTile
                className="shadow-custom-tile"
                rounded
                variant={ODS_TILE_VARIANT.flat}
              >
                <div className="flex flex-col w-full">
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.heading}
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="mb-5"
                  >
                    {t(
                      isPostPaidUsageBilling
                        ? 'cpbhd_monthly_post_paid_header'
                        : 'cpbhd_monthly_header',
                      {
                        ...translationValues,
                      },
                    )}
                  </OsdsText>

                  <MonthlyConsumption consumption={consumption} />
                </div>
              </OsdsTile>

              <OsdsTile
                className="shadow-custom-tile"
                rounded
                variant={ODS_TILE_VARIANT.flat}
              >
                <div className="flex flex-col w-full">
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.heading}
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="mb-5"
                  >
                    {t('cpbhd_hourly_header', { ...translationValues })}
                  </OsdsText>

                  <HourlyConsumption
                    consumption={consumption}
                    isTrustedZone={isTrustedZone}
                  />
                </div>
              </OsdsTile>
            </div>
            <Outlet />
          </>
        )}
      </>
    </div>
  );
}
