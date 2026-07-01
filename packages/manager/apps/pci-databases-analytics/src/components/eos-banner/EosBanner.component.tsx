import { Alert, AlertDescription } from '@datatr-ux/uxlib';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { isEndOfLifecycle } from '@/lib/availabilitiesHelper';

interface EosBannerProps {
  availability?: database.Availability;
  /**
   * Tailors the recommendation to the screen: 'update' invites the user to
   * update the current service, 'fork' invites them to pick a supported version
   * for the new forked service.
   */
  context?: 'update' | 'fork';
}

/**
 * Warns the user when the current service configuration is no longer fully
 * supported (deprecated / end of sale / end of life). Renders nothing for a
 * healthy (STABLE/BETA) availability.
 */
const EosBanner = ({ availability, context = 'update' }: EosBannerProps) => {
  const { t } = useTranslation('pci-databases-analytics/components/eos-banner');
  if (!isEndOfLifecycle(availability)) {
    return null;
  }
  const baseKey =
    availability.lifecycle.status ===
    database.availability.StatusEnum.END_OF_LIFE
      ? 'endOfLife'
      : 'endOfSale';
  const message = context === 'fork' ? `${baseKey}Fork` : baseKey;
  return (
    <Alert variant="warning" data-testid="eos-banner" className="mb-4">
      <div className="flex items-center gap-4">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <AlertDescription>{t(message)}</AlertDescription>
      </div>
    </Alert>
  );
};

export default EosBanner;
