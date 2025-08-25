import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useParams } from 'react-router-dom';
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
import { useCallbacks } from '@/pages/billing/estimate/callbacks';

export default function Estimate(): JSX.Element {
  const { i18n } = useTranslation('estimate');

  const userLocale = getDateFnsLocale(i18n.language);

  const { currency } = useEnvironment().getUser();

  const { projectId = '' } = useParams();

  const { create, update, remove } = useCallbacks();

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

  const { createAlert, isPending: isAlertCreating } = useCreateAlert(
    projectId,
    create.success,
    create.failure,
  );

  const { updateAlert, isPending: isAlertUpdating } = useUpdateAlert(
    projectId,
    update.success,
    update.failure,
  );

  const { deleteAlert, isPending: isAlertDeleting } = useDeleteAlert(
    projectId,
    remove.success,
    remove.failure,
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
        totalPrice={forecastPrices.totalPrice}
        totalHourlyPrice={forecastPrices.totalHourlyPrice}
        totalMonthlyPrice={forecastPrices.totalMonthlyPrice}
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
