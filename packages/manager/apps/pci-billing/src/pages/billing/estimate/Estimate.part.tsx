import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { addMonths, format } from 'date-fns';
import * as locales from 'date-fns/locale';
import { Currency } from '@ovh-ux/manager-config';
import { useCallback } from 'react';

export type TEstimateProps = {
  currency: Currency;
  totalMonthlyPrice: number;
  totalHourlyPrice: number;
  totalPrice: number;
  isPending: boolean;
  locale: string;
};

export const EstimatePart = ({
  currency,
  totalMonthlyPrice,
  totalHourlyPrice,
  isPending,
  totalPrice,
  locale,
}: TEstimateProps): JSX.Element => {
  const { t: tConsumption } = useTranslation('consumption');
  const { t: tEstimate } = useTranslation('estimate');

  const formatMonth = useCallback(
    (stamp: number | Date) =>
      format(stamp, 'MMMM', {
        locale:
          locale in locales
            ? locales[locale as keyof typeof locales]
            : locales.fr,
      }),
    [locale],
  );

  const [currentMonth, nextMonth] = [
    formatMonth(Date.now()),
    formatMonth(addMonths(Date.now(), 1)),
  ];

  return (
    <div>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tConsumption('cpbc_tab_forecast')}
      </OsdsText>
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tEstimate('cpbe_estimate_summary_header', {
            month: nextMonth,
          })}{' '}
          <strong>
            {totalPrice.toFixed(2)} {currency.symbol}
          </strong>
        </OsdsText>
      </p>
      {isPending ? (
        <OsdsSpinner inline />
      ) : (
        <div>
          <p>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: tEstimate(
                    'cpbe_estimate_summary_renew_monthly_sub_label',
                    {
                      total: `${totalMonthlyPrice.toFixed(2)} ${
                        currency.symbol
                      }`,
                    },
                  ),
                }}
              ></span>
            </OsdsText>
          </p>
          <p>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: tEstimate(
                    'cpbe_estimate_summary_hourly_consumption_label',
                    {
                      month: currentMonth,
                      total: `${totalHourlyPrice.toFixed(2)} ${
                        currency.symbol
                      }`,
                    },
                  ),
                }}
              ></span>
            </OsdsText>
          </p>
        </div>
      )}
    </div>
  );
};
