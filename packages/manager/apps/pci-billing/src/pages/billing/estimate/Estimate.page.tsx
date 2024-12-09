import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { AlertsPart } from './Alerts.part';
import { EstimatePart } from './Estimate.part';
import { useUsagePrice } from '@/hooks/useUsagePrice';
import { useEnvironment } from '@/hooks/useEnvironment';
import {
  useCreateAlert,
  useDeleteAlert,
  useGetAlert,
  useUpdateAlert,
} from '@/api/hooks/useAlerting';
import queryClient from '@/queryClient';

export default function Estimate(): JSX.Element {
  const { i18n, t: tEstimate } = useTranslation('estimate');

  const userLocale = getDateFnsLocale(i18n.language);

  const { currency } = useEnvironment().getUser();

  const { projectId } = useParams();

  const { addSuccess, addError, clearNotifications } = useNotifications();

  const {
    data: forecastPrices,
    isPending: isForecastPricesPending,
  } = useUsagePrice(projectId, 'forecast');
  const {
    data: currentPrices,
    isPending: isCurrentPricesPending,
    error: currentPricesError,
  } = useUsagePrice(projectId, 'current');

  const { data: alert, isLoading: isAlertLoading } = useGetAlert(projectId);

  const invalidateCache = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['project', projectId, 'alerting'],
    });
  };

  const { createAlert, isPending: isAlertCreating } = useCreateAlert(
    projectId,
    async () => {
      clearNotifications();
      addSuccess(tEstimate('cpbea_estimate_alert_success'), true);
      await invalidateCache();
    },
    () => {
      addError(tEstimate('cpbea_estimate_alert_error'), true);
    },
  );

  const { updateAlert, isPending: isAlertUpdating } = useUpdateAlert(
    projectId,
    async () => {
      clearNotifications();
      addSuccess(tEstimate('cpbea_estimate_alert_success'), true);
      await invalidateCache();
    },
    () => {
      addError(tEstimate('cpbea_estimate_alert_error'), true);
    },
  );

  const { deleteAlert, isPending: isAlertDeleting } = useDeleteAlert(
    projectId,
    async () => {
      clearNotifications();
      addSuccess(tEstimate('cpbe_estimate_alert_delete_success'), true);
      await invalidateCache();
    },
    (err: ApiError) => {
      clearNotifications();
      addError(
        `${tEstimate('cpbe_estimate_alert_delete_error')} ${err.response?.data
          ?.message || ''}`,
        true,
      );
    },
  );

  const isLoading =
    isForecastPricesPending ||
    isCurrentPricesPending ||
    isAlertLoading ||
    isAlertCreating ||
    isAlertUpdating ||
    isAlertDeleting;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <EstimatePart
        currency={currency}
        totalPrice={forecastPrices?.totalPrice}
        totalHourlyPrice={forecastPrices?.totalHourlyPrice}
        totalMonthlyPrice={forecastPrices?.totalMonthlyPrice}
        isPending={isForecastPricesPending}
        locale={userLocale}
      />
      <AlertsPart
        projectId={projectId}
        currency={currency}
        forecastTotalHourlyPrice={forecastPrices.totalHourlyPrice}
        currentTotalHourlyPrice={currentPrices.totalHourlyPrice}
        currentPricesError={currentPricesError}
        alert={alert}
        onCreate={createAlert}
        onUpdate={updateAlert}
        onDelete={deleteAlert}
        isLoading={isLoading}
      />
    </div>
  );
}
