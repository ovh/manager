import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Badge,
  Button,
  ICON_NAME,
  Icon,
  TOOLTIP_POSITION,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Link } from '@ovh-ux/muk';

import { BadgeStatus, getStatusColor } from '@/components/badgeStatus/BadgeStatus.component';
import { useWebHostingAttachedDomaindigStatus } from '@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus';
import { useGetHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { WebHostingType, WebHostingWebsiteDomainType } from '@/data/types/product/webHosting';
import { WebSiteAttachedDomainDigStatusType, WebsiteType } from '@/data/types/product/website';
import { DnsStatus, GitStatus, ServiceStatus } from '@/data/types/status';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { useHostingUrl } from '@/hooks/useHostingUrl';
import { DATAGRID_LINK, DIAGNOSTIC, WEBSITE } from '@/utils/tracking.constants';

const useHostingUrlWithOptions = (
  serviceName: string,
  withMultisite = false,
  withBoost = false,
) => {
  const { data: availability } = useFeatureAvailability(['web-hosting:multisite-react']);
  const multisiteUrl = useGenerateUrl(`/${serviceName}/multisite`, 'path');
  const hostingUrl = useHostingUrl(serviceName);
  const boostUrl = useHostingUrl(serviceName, 'boost');

  if (withBoost) {
    return boostUrl;
  }

  if (withMultisite && availability?.['web-hosting:multisite-react']) {
    return `#${multisiteUrl}`;
  }
  return hostingUrl;
};

const getDnsStatusAndTooltip = (
  type: 'A' | 'AAAA',
  data: WebSiteAttachedDomainDigStatusType,
  hostingData: WebHostingType,
) => {
  const records = Object.values(data.records).filter((r) => r.type === type);
  const recommendedIps =
    type === 'A' ? data.recommendedIps.recommendedIpV4 : data.recommendedIps.recommendedIpV6;

  const clusterIp = hostingData?.hasCdn ? hostingData?.hostingIp : hostingData?.clusterIp;
  const clusterIpv6 = hostingData?.hasCdn ? hostingData?.hostingIpv6 : hostingData?.clusterIpv6;
  const hostingIp = type === 'A' ? clusterIp : clusterIpv6;
  if (!records.length) {
    return {
      status: DnsStatus.NOT_CONFIGURED,
      tooltipKey: 'multisite:multisite_tooltip_diagnostic_unconfigured',
      ip: hostingIp,
    };
  }

  let hasValidRecord = false;
  let ipFound = '';
  let externalIp = '';

  hasValidRecord = records.some((record) => {
    if (record.dnsConfigured && record.isOvhIp) {
      const recordIp = Object.keys(data.records).find((ip) => data.records[ip] === record);
      if (recordIp && recommendedIps.includes(recordIp)) {
        ipFound = recordIp;
        return true;
      }
    }
    return false;
  });

  let status: DnsStatus;
  let tooltipKey: string;

  if (hasValidRecord) {
    status = DnsStatus.CONFIGURED;
    tooltipKey = 'multisite:multisite_tooltip_diagnostic_good_configuration';
  } else {
    ipFound = hostingIp;
    const hasExternalRecord = records.some((r) => !r.isOvhIp);
    if (hasExternalRecord) {
      status = DnsStatus.EXTERNAL;
      externalIp = Object.keys(data.records).find((ip) => data.records[ip].type === type);
      tooltipKey = 'multisite:multisite_tooltip_diagnostic_not_good_configuration';
    } else {
      status = DnsStatus.NOT_CONFIGURED;
      tooltipKey = 'multisite:multisite_tooltip_diagnostic_unconfigured';
    }
  }

  return { status, tooltipKey, ip: ipFound, externalIp };
};

interface DiagnosticCellProps {
  serviceName: string;
  fqdn: string;
  isWebsiteView?: boolean;
}

export const DiagnosticCell = ({ serviceName, fqdn, isWebsiteView }: DiagnosticCellProps) => {
  const { t } = useTranslation('common');
  const hostingUrl = useHostingUrlWithOptions(serviceName, true, false);
  const { data: hostingData } = useGetHostingService(serviceName);
  const { data, isLoading, isError, refetch } = useWebHostingAttachedDomaindigStatus(
    serviceName,
    fqdn,
  );

  if (isError) {
    return (
      <Button
        variant={BUTTON_VARIANT.ghost}
        color={BUTTON_COLOR.critical}
        onClick={() => {
          refetch().catch(console.error);
        }}
      >
        <>
          {t('web_hosting_status_diagnostic_error')}
          <Icon className="ml-2" name={ICON_NAME.refresh}></Icon>
        </>
      </Button>
    );
  }

  return ['A', 'AAAA'].map((type) => {
    const { status, tooltipKey, ip, externalIp } =
      !isLoading && data
        ? getDnsStatusAndTooltip(type as 'A' | 'AAAA', data, hostingData)
        : { status: DnsStatus.NOT_CONFIGURED, tooltipKey: '', ip: '', externalIp: '' };

    if (isWebsiteView) {
      return (
        <BadgeStatus
          key={type}
          itemStatus={status}
          label={type}
          tracking={`${DATAGRID_LINK}${DIAGNOSTIC}`}
          isLoading={isLoading}
          href={hostingUrl}
        />
      );
    }

    return (
      <React.Fragment key={type}>
        <Tooltip position={TOOLTIP_POSITION.top}>
          <TooltipTrigger asChild>
            <Badge
              className="mr-4"
              id={`diagnostic-status-${type}-${fqdn}`}
              color={getStatusColor(status)}
            >
              {type}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {t(tooltipKey, { domainName: fqdn, ip, type, externalIp })}
          </TooltipContent>
        </Tooltip>
      </React.Fragment>
    );
  });
};

interface BadgeStatusCellProps {
  webSiteItem: WebsiteType | WebHostingWebsiteDomainType;
  status: ServiceStatus | GitStatus;
  tracking?: string;
  withMultisite?: boolean;
  withBoost?: boolean;
}
const getHostingServiceName = (
  item: WebsiteType | WebHostingWebsiteDomainType,
): string | undefined => {
  if ('hosting' in item.currentState && item.currentState.hosting) {
    return item.currentState.hosting.serviceName;
  }
  return undefined;
};
export const BadgeStatusCell = ({
  webSiteItem,
  status,
  tracking,
  withMultisite = false,
  withBoost = false,
}: BadgeStatusCellProps) => {
  const serviceName = getHostingServiceName(webSiteItem);
  const hostingUrl = useHostingUrlWithOptions(serviceName || '', withMultisite, withBoost);

  return <BadgeStatus itemStatus={status} tracking={tracking} href={hostingUrl} />;
};

interface LinkCellProps {
  webSiteItem: WebsiteType;
  label: string;
  tracking?: string;
  withMultisite?: boolean;
}

export const LinkCell = ({
  webSiteItem,
  label,
  tracking,
  withMultisite = false,
}: LinkCellProps) => {
  const { trackClick } = useOvhTracking();
  const hostingUrl = useHostingUrlWithOptions(
    webSiteItem?.currentState.hosting.serviceName,
    withMultisite,
    false,
  );

  return (
    <Link
      href={hostingUrl}
      onClick={() =>
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: [`${DATAGRID_LINK}${tracking}_${WEBSITE}`],
        })
      }
      target="_blank"
    >
      {label}
    </Link>
  );
};
