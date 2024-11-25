import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useContext, useMemo, useState } from 'react';
import { addMonths, format } from 'date-fns';
import * as locales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useEstimate } from '@/hooks/useEstimate';
import { AlertModalComponent } from '@/pages/billing/estimate/components/AlertModal.component';
import { useGetAlert } from '@/api/hooks/useAlerting';
import { useChartData } from '@/api/hooks/useChartData';
import { createAlert, deleteAlert, updateAlert } from '@/api/data/alert';
import queryClient from '@/queryClient';

type TState = {
  nextMonth: string;
  isAlertModalShown: boolean;
};

export default function Estimate() {
  const { currency } = useContext(ShellContext).environment.getUser();
  const { i18n, t: tLegacy } = useTranslation('legacy');
  const { t: tEstimate } = useTranslation('estimate');

  const { addSuccess, addError } = useNotifications();

  const userLocale = getDateFnsLocale(i18n.language);

  const { projectId } = useParams();

  const {
    totalPrice: forecastTotalPrice,
    totalMonthlyPrice: forecastTotalMonthlyPrice,
    totalHourlyPrice: forecastTotalHourlyPrice,
  } = useEstimate(projectId, 'forecast');

  const chartData = useChartData(projectId);

  const { data: alert, isLoading: isAlertLoading } = useGetAlert(projectId);

  const [state, setState] = useState<TState>({
    nextMonth: format(addMonths(Date.now(), 1), 'MMMM', {
      locale:
        userLocale in locales
          ? locales[userLocale as keyof typeof locales]
          : locales.fr,
    }),
    isAlertModalShown: false,
  });

  const data = useMemo(
    () => [
      {
        name: chartData?.estimate.now.label,
        value: chartData?.estimate.now.value,
        fill: '#777',
      },
      {
        name: chartData?.estimate.endOfMonth.label,
        value: chartData?.estimate.endOfMonth.value,
        fill: '#ddd',
      },
    ],
    [chartData],
  );

  const createOrUpdate = async ({
    email,
    threshold,
  }: {
    email: string;
    threshold: number;
  }) => {
    try {
      if (!alert) {
        await createAlert(projectId, email, threshold);
        addSuccess(tEstimate('cpbea_estimate_alert_success'), true);
      } else {
        await updateAlert(projectId, alert?.id, email, threshold);
        addSuccess(tEstimate('cpbea_estimate_alert_success'), true);
      }
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'alerting'],
      });
    } catch (e) {
      addError(tEstimate('cpbea_estimate_alert_error'), true);
    }
    setState({ ...state, isAlertModalShown: false });
  };

  const remove = async () => {
    await deleteAlert(projectId, alert?.id);
    await queryClient.invalidateQueries({
      queryKey: ['project', projectId, 'alerting'],
    });
    addSuccess(tEstimate('cpbe_estimate_alert_delete_success'), true);
  };

  return (
    <div className="flex">
      <div className="basis-7/12">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tLegacy('cpbc_tab_forecast')}
        </OsdsText>
        <p>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tEstimate('cpbe_estimate_summary_header', {
              month: state.nextMonth,
            })}{' '}
            <strong>
              {forecastTotalPrice} {currency.symbol}
            </strong>
          </OsdsText>
        </p>
        {isAlertLoading ? (
          <OsdsSpinner inline />
        ) : (
          <div>
            <p>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: tEstimate(
                      'cpbe_estimate_summary_renew_monthly_sub_label',
                      {
                        total: `${forecastTotalMonthlyPrice} ${currency.symbol}`,
                      },
                    ),
                  }}
                ></span>
              </OsdsText>
            </p>
            <p>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: tEstimate(
                      'cpbe_estimate_summary_hourly_consumption_label',
                      {
                        month: state.nextMonth,
                        total: `${forecastTotalHourlyPrice} ${currency.symbol}`,
                      },
                    ),
                  }}
                ></span>
              </OsdsText>
            </p>
          </div>
        )}
      </div>

      <div className="basis-5/12">
        <div className="shadow-md rounded-sm p-6">
          <div>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {tEstimate('cpbe_estimate_alert_header_title')}
            </OsdsText>
          </div>
          <div>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {tEstimate('cpbe_estimate_alert_header_description')}
            </OsdsText>
          </div>
          {isAlertLoading ? (
            <OsdsSpinner inline />
          ) : (
            <>
              {alert ? (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                          top: 30,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          label={{ position: 'top', fill: 'black' }}
                          dataKey="value"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <OsdsButton
                      color={ODS_THEME_COLOR_INTENT.primary}
                      variant={ODS_BUTTON_VARIANT.stroked}
                      inline
                      size={ODS_BUTTON_SIZE.sm}
                      onClick={() =>
                        setState({ ...state, isAlertModalShown: true })
                      }
                    >
                      {tEstimate('cpbe_estimate_alert_edit')}{' '}
                    </OsdsButton>
                    <OsdsButton
                      className="ml-2"
                      color={ODS_THEME_COLOR_INTENT.primary}
                      variant={ODS_BUTTON_VARIANT.stroked}
                      inline
                      size={ODS_BUTTON_SIZE.sm}
                      onClick={() => remove()}
                    >
                      {tEstimate('cpbe_estimate_alert_delete')}{' '}
                    </OsdsButton>
                  </div>
                </>
              ) : (
                <div className="mt-8">
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    variant={ODS_BUTTON_VARIANT.flat}
                    inline
                    size={ODS_BUTTON_SIZE.sm}
                    onClick={() =>
                      setState({ ...state, isAlertModalShown: true })
                    }
                  >
                    {tEstimate('cpbe_estimate_alert_create')}{' '}
                  </OsdsButton>
                </div>
              )}
            </>
          )}

          {state.isAlertModalShown && (
            <AlertModalComponent
              email={alert?.email}
              threshold={alert?.monthlyThreshold}
              onClose={() => setState({ ...state, isAlertModalShown: false })}
              onInput={createOrUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
