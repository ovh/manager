import {
  OsdsButton,
  OsdsIcon,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Currency } from '@ovh-ux/manager-config';
import { AlertModalComponent } from '@/pages/billing/estimate/components/AlertModal.component';

import queryClient from '@/queryClient';
import { TAlert } from '@/api/data/alert';

export type TAlertsPart = {
  projectId: string;
  currency: Currency;
  currentTotalHourlyPrice: number;
  forecastTotalHourlyPrice: number;
  currentPricesError: ApiError;
  alert: TAlert;
  onCreate: ({
    email,
    threshold,
  }: {
    email: string;
    threshold: number;
  }) => void;
  onUpdate: ({
    alertId,
    email,
    threshold,
  }: {
    alertId: string;
    email: string;
    threshold: number;
  }) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
};

export const AlertsPart = ({
  projectId,
  currency,
  currentTotalHourlyPrice,
  forecastTotalHourlyPrice,
  currentPricesError,
  alert,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
}: TAlertsPart): JSX.Element => {
  const { t: tEstimate } = useTranslation('estimate');

  const { addError } = useNotifications();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const chartData = [
    {
      label: tEstimate('cpbe_estimate_alert_chart_label_now'),
      value: currentTotalHourlyPrice,
      fill: '#777',
    },
    {
      label: tEstimate('cpbe_estimate_alert_chart_label_future'),
      value: forecastTotalHourlyPrice,
      fill: '#ddd',
    },
  ];

  const maxRange =
    Math.max(
      currentTotalHourlyPrice,
      forecastTotalHourlyPrice,
      alert?.monthlyThreshold,
    ) * 1.1;

  const createOrUpdate = async ({
    email,
    threshold,
  }: {
    email: string;
    threshold: number;
  }) => {
    try {
      if (!alert) {
        onCreate({ email, threshold });
      } else {
        onUpdate({ alertId: alert?.id, email, threshold });
      }
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'alerting'],
      });
    } catch (e) {
      addError(tEstimate('cpbea_estimate_alert_error'), true);
    }
    closeModal();
  };

  const remove = async () => {
    onDelete(alert?.id);
  };

  return (
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
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tEstimate('cpbe_estimate_alert_header_description')}
        </OsdsText>
      </p>
      {isLoading ? (
        <OsdsSpinner inline />
      ) : (
        <>
          {alert ? (
            <>
              <div className="h-[300px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  className="ods-font"
                >
                  <ComposedChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 30,
                      right: 40,
                      left: 40,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis domain={[0, maxRange]} />
                    <Tooltip />
                    <Bar
                      label={{
                        position: 'top',
                        fill: 'black',
                        className: 'font-bold text-xs',
                        formatter: (value: number) => value.toFixed(2),
                      }}
                      dataKey="value"
                      barSize={100}
                    />
                    <ReferenceLine
                      type="monotone"
                      y={alert.monthlyThreshold}
                      stroke="red"
                      label={{
                        position: 'left',
                        value: `Limit`,
                        className: 'font-bold text-xs ',
                        fill: 'black',
                      }}
                    />
                    <ReferenceLine
                      type="monotone"
                      y={alert.monthlyThreshold}
                      stroke="red"
                      label={{
                        position: 'right',
                        value: `${alert.monthlyThreshold} ${currency.symbol}`,
                        className: 'font-bold text-xs',
                        fill: 'black',
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div>
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  inline
                  size={ODS_BUTTON_SIZE.sm}
                  onClick={openModal}
                >
                  {tEstimate('cpbe_estimate_alert_edit')}{' '}
                </OsdsButton>
                <OsdsButton
                  className="ml-2"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.flat}
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
                onClick={openModal}
                disabled={!!currentPricesError || undefined}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.BELL}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  contrasted
                  aria-hidden="true"
                  className="mr-2"
                />
                {tEstimate('cpbe_estimate_alert_create')}{' '}
              </OsdsButton>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <AlertModalComponent
          email={alert?.email}
          threshold={alert?.monthlyThreshold}
          onClose={closeModal}
          onInput={createOrUpdate}
          isPending={isLoading}
          currency={currency}
        />
      )}
    </div>
  );
};
