import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { getZoneStatus, type ZoneStatus } from '@/zone/datas/api';
import { getZoneHistory } from '@/zone/data/api/history.api';
import { TDomainZone } from '@/domain/types/domainZone';
import { TDomainResource } from '@/domain/types/domainResource';
import { ZoneRecord } from '@/zone/types/zoneRecords.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BannerColor = 'warning' | 'critical' | 'information';

interface BannerConfig {
  /** Translation key (may contain HTML via <bold>) */
  key: string;
  /** ODS Message color */
  color: BannerColor;
  /** Icon name */
  icon: 'triangle-exclamation' | 'hexagon-exclamation' | 'circle-info';
  /** Whether the banner should be rendered */
  visible: boolean;
  /** Optional extra content (list of items, nameserver lists, …) */
  extra?: React.ReactNode;
  /** When true, the key label is not rendered (extra already contains the full content) */
  hideTitle?: boolean;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ZoneBannersProps {
  readonly serviceName: string;
  readonly domainZone: TDomainZone | undefined;
  readonly domainResource: TDomainResource | undefined;
  readonly records: ZoneRecord[];
  readonly isLoadingRecords: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ZoneBanners({
  serviceName,
  domainZone,
  domainResource,
  records,
  isLoadingRecords,
}: ZoneBannersProps) {
  const { t } = useTranslation(['zone']);

  // ---- 1. Zone status (warnings / errors) ---------------------------------
  const { data: zoneStatus } = useQuery<ZoneStatus>({
    queryKey: ['zone', 'status', serviceName],
    queryFn: () => getZoneStatus(serviceName),
    enabled: !!serviceName && !!domainZone,
    retry: false,
  });

  const zoneStatusWarnings = zoneStatus?.warnings ?? [];
  const zoneStatusErrors =
    zoneStatus && !zoneStatus.isDeployed ? zoneStatus.errors ?? [] : [];

  // ---- 2. Nameserver mismatch --------------------------------------------
  // 2a. Default NS from zone records (NS with empty subdomain)
  const defaultNs = useMemo(() => {
    return records
      .filter(
        (r) =>
          r.fieldType === 'NS' &&
          r.subDomain === '' &&
          r.subDomainToDisplay === '',
      )
      .map((r) => r.targetToDisplay.replace(/\.$/, ''))
      .sort();
  }, [records]);

  // 2b. Active NS from domain resource APIv2 (currentState.dnsConfiguration.nameServers)
  const activatedNs = useMemo(() => {
    if (!domainResource?.currentState?.dnsConfiguration?.nameServers) return [];
    return domainResource.currentState.dnsConfiguration.nameServers
      .map((ns) => ns.nameServer)
      .sort();
  }, [domainResource]);

  const dnsMismatch = useMemo(() => {
    if (activatedNs.length === 0 || defaultNs.length === 0) return false;
    return JSON.stringify(defaultNs) !== JSON.stringify(activatedNs);
  }, [defaultNs, activatedNs]);

  // ---- 3. Propagation (change in last 24h) --------------------------------
  const { data: historyDates } = useQuery<string[]>({
    queryKey: ['zone', 'history', serviceName],
    queryFn: () => getZoneHistory(serviceName),
    enabled: !!serviceName && !!domainZone,
    retry: false,
  });

  const hasPropagation = useMemo(() => {
    if (!historyDates || historyDates.length === 0) return false;
    const sorted = [...historyDates].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
    const latest = new Date(sorted[0]);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return latest > oneDayAgo;
  }, [historyDates]);

  // ---- 4. Empty zone -------------------------------------------------------
  const isEmptyZone = !isLoadingRecords && records.length === 0;

  // ---- Banner mapping -------------------------------------------------------
  const banners: BannerConfig[] = [
    // DNS mismatch
    {
      key: 'zone_page_banner_dns_mismatch',
      color: 'warning',
      icon: 'triangle-exclamation',
      visible: dnsMismatch,
      hideTitle: true,
      extra: (
        <div className="flex flex-col gap-1">
          <Text preset={TEXT_PRESET.span} className="font-bold">
            {t('zone_page_banner_dns_mismatch_title')}
          </Text>
          <Text preset={TEXT_PRESET.span}>
            {t('zone_page_banner_dns_mismatch_description')}
            <br/>
             {t('zone_page_banner_dns_mismatch_description2')}
          </Text>
        </div>
      ),
    },
    // Zone status errors
    {
      key: 'zone_page_banner_zone_status_error',
      color: 'critical',
      icon: 'hexagon-exclamation',
      visible: zoneStatusErrors.length > 0,
      extra: (
        <ul className="list-disc ml-6 mt-1 mb-0">
          {zoneStatusErrors.map((err, i) => (
            <li key={i}>
              <Text preset={TEXT_PRESET.span}>{err}</Text>
            </li>
          ))}
        </ul>
      ),
    },
    // Zone status warnings
    {
      key: 'zone_page_banner_zone_status_warning',
      color: 'warning',
      icon: 'triangle-exclamation',
      visible: zoneStatusWarnings.length > 0,
      extra: (
        <ul className="mt-1 mb-0">
          {zoneStatusWarnings.map((warn, i) => (
            <li key={i}>
              <Text preset={TEXT_PRESET.span}>{warn}</Text>
            </li>
          ))}
        </ul>
      ),
    },
    // Propagation
    {
      key: 'zone_page_banner_propagation',
      color: 'information',
      icon: 'circle-info',
      visible: hasPropagation,
    },
    // Empty zone
    {
      key: 'zone_page_banner_empty_zone',
      color: 'information',
      icon: 'circle-info',
      visible: isEmptyZone,
    },
  ];

  const visibleBanners = banners.filter((b) => b.visible);

  if (visibleBanners.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-4">
      {visibleBanners.map((banner) => (
        <Message
          key={banner.key}
          color={banner.color as MESSAGE_COLOR}
          dismissible={false}
          className="w-full"
        >
          <MessageIcon name={banner.icon} />
          <div>
            {!banner.hideTitle && <Text preset={TEXT_PRESET.paragraph} className={banner.extra ? 'font-bold mb-0' : undefined}>{t(banner.key)}</Text>}
            {banner.extra}
          </div>
        </Message>
      ))}
    </div>
  );
}
