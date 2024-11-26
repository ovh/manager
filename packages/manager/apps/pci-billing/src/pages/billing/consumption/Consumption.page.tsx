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
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { PCI_FEATURES_BILLING_POST_PAID, TRUSTED_ZONE } from '@/constants';
import MonthlyConsumption from '@/components/consumption/MonthlyConsumption.component';
import HourlyConsumption from '@/components/consumption/HourlyConsumption.component';
import { useGeTCurrentUsage } from '@/api/hook/useConsumption';

export default function Consumption() {
  const { t } = useTranslation('consumption');

  const { projectId } = useParams();
  const { currency } = useContext(ShellContext).environment.getUser();

  const { data: availability } = useFeatureAvailability([
    PCI_FEATURES_BILLING_POST_PAID,
    TRUSTED_ZONE,
  ]);

  const { data: consumption, isPending } = useGeTCurrentUsage(projectId);

  const isTrustedZone = availability && availability[TRUSTED_ZONE];

  const monthlyTotal = `${consumption?.totals?.monthly?.total?.toFixed(2)} ${
    currency.symbol
  }`;
  const hourlyTotal = `${consumption?.totals?.hourly?.total?.toFixed(2)} ${
    currency.symbol
  }`;

  return (
    <>
      {isPending ? (
        <OsdsSpinner
          className="block text-center"
          inline
          size={ODS_SPINNER_SIZE.md}
        />
      ) : (
        <>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
            className="block my-5"
          >
            {t('cpbc_tab_consumption')}
          </OsdsText>
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
                  {t('cpbc_monthly_header')}
                </OsdsText>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.caption}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="mb-5"
                >
                  {`${t('cpbc_monthly_header_description')} (${monthlyTotal})`}
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
                  {t('cpbc_hourly_header')}
                </OsdsText>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.caption}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="mb-5"
                >
                  {`${t('cpbc_hourly_header_description')} (${hourlyTotal})`}
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
  );
}
