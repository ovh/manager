import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Tile } from '@ovh-ux/muk';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { useServiceInfo } from '@/hooks/dashboard/useServiceInfo';
import SpaceMeter from '@/components/SpaceMeter/SpaceMeter.component';

type MetricsProps = {
  serviceName: string;
  onRenewClick?: () => void;
  onMonitoredChanged?: (monitored: boolean) => void;
  isMonitoredUpdating?: boolean;
};

/**
 * Simplified Metrics component
 * Displays service metrics (IP, datacenter, capacity, dates, monitored switch)
 * TODO: Implement full metrics component when needed
 */
export default function Metrics({
  serviceName,
  onRenewClick,
  onMonitoredChanged,
  isMonitoredUpdating = false,
}: MetricsProps) {
  const { t } = useTranslation(['common', 'nasha']);
  const { data: nasha } = useNashaDetail(serviceName);
  const { data: serviceInfo } = useServiceInfo(serviceName);
  const { data: renewUrl } = useNavigationGetUrl([
    'dedicated',
    '#/billing/autoRenew',
    {
      selectedType: 'DEDICATED_NASHA',
      searchText: serviceName,
    },
  ]);

  const creationDate = useMemo(() => {
    if (!serviceInfo?.creation) return '-';
    return new Date(serviceInfo.creation).toLocaleDateString();
  }, [serviceInfo]);

  const expirationDate = useMemo(() => {
    if (!serviceInfo?.expiration) return '-';
    return new Date(serviceInfo.expiration).toLocaleDateString();
  }, [serviceInfo]);

  if (!nasha) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="nasha-metrics mb-5">
      <Tile.Root title={t('nasha:metrics.title', 'General metrics')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('nasha:metrics.ip', 'IP')} />
              <Tile.Item.Description>{nasha.ip || '-'}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('nasha:metrics.datacenter', 'Datacenter')} />
              <Tile.Item.Description>{nasha.localeDatacenter}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('nasha:metrics.capacity', 'Capacity')} />
              <Tile.Item.Description>
                <SpaceMeter usage={nasha.use} large legend />
                <p className="text-sm text-gray-600 mt-2">
                  <em>{t('nasha:metrics.capacity_delay_text', 'Data may be delayed by a few minutes')}</em>
                </p>
              </Tile.Item.Description>
            </Tile.Item.Root>
          </div>
          <div>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('nasha:metrics.creation_date', 'Creation date')} />
              <Tile.Item.Description>{creationDate}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('nasha:metrics.expiration_date', 'Expiration date')} />
              <Tile.Item.Description>
                {expirationDate}
                {renewUrl && (
                  <a
                    href={renewUrl as string}
                    onClick={onRenewClick}
                    target="_top"
                    className="ml-2 text-primary hover:underline"
                  >
                    {t('nasha:metrics.renew', 'Renew')} →
                  </a>
                )}
              </Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('nasha:metrics.space_usage', 'Space usage notification')} />
              <Tile.Item.Description>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nasha.monitored ?? false}
                    disabled={isMonitoredUpdating}
                    onChange={(e) => onMonitoredChanged?.(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm">
                    {nasha.monitored
                      ? t('nasha:metrics.monitored_on', 'Usage notification is enabled')
                      : t('nasha:metrics.monitored_off', 'Usage notification is disabled')}
                  </span>
                </label>
              </Tile.Item.Description>
            </Tile.Item.Root>
          </div>
        </div>
      </Tile.Root>
    </div>
  );
}



