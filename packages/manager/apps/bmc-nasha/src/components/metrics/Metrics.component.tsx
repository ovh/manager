import { useState, useEffect } from 'react';
import { Button, Switch, ICON_NAME, Icon } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { SpaceMeter } from '@/components/space-meter/SpaceMeter.component';
import type { NashaPrepared } from '@/types/Dashboard.type';
import type { ServiceInfo } from '@/types/Dashboard.type';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/Nasha.constants';

type MetricsProps = {
  nasha: NashaPrepared;
  serviceInfo: ServiceInfo;
  urlRenew: string;
  onRenewClick: () => void;
  onMonitoredChanged: (monitored: boolean) => Promise<void>;
  monitoredDisabled?: boolean;
};

export function Metrics({
  nasha,
  serviceInfo,
  urlRenew,
  onRenewClick,
  onMonitoredChanged,
  monitoredDisabled = false,
}: MetricsProps) {
  const { t } = useTranslation('dashboard');
  const { trackClick } = useOvhTracking();
  const [isMonitoredUpdating, setIsMonitoredUpdating] = useState(false);
  const [monitored, setMonitored] = useState(nasha.monitored);

  // Sync monitored state when nasha changes
  useEffect(() => {
    setMonitored(nasha.monitored);
  }, [nasha.monitored]);

  const handleMonitoredChange = async (checked: boolean) => {
    setMonitored(checked);
    trackClick({
      actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, `usage-notification::${checked ? 'enable' : 'disable'}`],
    });
    setIsMonitoredUpdating(true);
    try {
      await onMonitoredChanged(checked);
    } catch (error) {
      // Revert on error
      setMonitored(!checked);
    } finally {
      setIsMonitoredUpdating(false);
    }
  };

  const handleRenewClick = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'renew'] });
    onRenewClick();
  };

  const creationDate = serviceInfo?.creation
    ? new Date(serviceInfo.creation).toLocaleDateString()
    : '';
  const expirationDate = serviceInfo?.expiration
    ? new Date(serviceInfo.expiration).toLocaleDateString()
    : '';

  return (
    <div className="nasha-metrics bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <dl className="space-y-4">
            {nasha.ip && (
              <div className="flex justify-between">
                <dt className="font-semibold">
                  {t('nasha_components_metrics_ip', { defaultValue: 'IP' })}
                </dt>
                <dd>{nasha.ip}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="font-semibold">
                {t('nasha_components_metrics_datacenter', { defaultValue: 'Datacenter' })}
              </dt>
              <dd>{nasha.localeDatacenter}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">
                {t('nasha_components_metrics_capacity', { defaultValue: 'Capacity' })}
              </dt>
              <dd className="w-full">
                <SpaceMeter usage={nasha.use} large legend />
                <p className="text-sm text-gray-500 mt-2 italic">
                  {t('nasha_components_metrics_capacity_delay_text', {
                    defaultValue: 'Capacity information may be delayed by up to 24 hours',
                  })}
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div className="col-span-1">
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="font-semibold">
                {t('nasha_components_metrics_creation_date', { defaultValue: 'Creation date' })}
              </dt>
              <dd>{creationDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">
                {t('nasha_components_metrics_expiration_date', { defaultValue: 'Expiration date' })}
              </dt>
              <dd>
                <div className="flex flex-col gap-2">
                  <span>{expirationDate}</span>
                  <Button
                    variant="link"
                    size="m"
                    onClick={handleRenewClick}
                    href={urlRenew}
                    target="_top"
                    className="flex items-center gap-2"
                  >
                    {t('nasha_components_metrics_renew', { defaultValue: 'Renew' })}
                    <Icon name={ICON_NAME.arrowRight} aria-hidden={true} />
                  </Button>
                </div>
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="font-semibold">
                {t('nasha_components_metrics_space_usage', { defaultValue: 'Space usage notification' })}
              </dt>
              <dd className="flex items-center gap-2">
                <Switch
                  checked={monitored}
                  onChange={handleMonitoredChange}
                  disabled={monitoredDisabled || isMonitoredUpdating}
                  aria-label={t('nasha_components_metrics_space_usage', {
                    defaultValue: 'Space usage notification',
                  })}
                />
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  title={t('nasha_components_metrics_space_usage_help', {
                    defaultValue: 'Enable notifications when storage usage exceeds thresholds',
                  })}
                  aria-label={t('nasha_components_metrics_space_usage_help', {
                    defaultValue: 'Help',
                  })}
                >
                  <Icon name={ICON_NAME.circleQuestion} />
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
