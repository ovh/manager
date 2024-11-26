import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { AlertsPart } from './Alerts.part';
import { EstimatePart } from '@/pages/billing/estimate/Estimate.part';
import { useUsagePrice } from '@/hooks/useUsagePrice';

export default function Estimate(): JSX.Element {
  const { i18n } = useTranslation('legacy');

  const userLocale = getDateFnsLocale(i18n.language);

  const { currency } = useContext(ShellContext).environment.getUser();

  const { projectId } = useParams();

  const forecastPrices = useUsagePrice(projectId, 'forecast');
  const currentPrices = useUsagePrice(projectId, 'current');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <EstimatePart
        currency={currency}
        forecastPrices={forecastPrices}
        locale={userLocale}
      />
      <AlertsPart
        projectId={projectId}
        currency={currency}
        forecastPrices={forecastPrices}
        currentPrices={currentPrices}
      />
    </div>
  );
}
