import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_TOOLTIP_POSITION,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsButton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { Links } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BadgeStatus, getStatusColor } from '@/components/badgeStatus/BadgeStatus.component';
import { useWebHostingAttachedDomaindigStatus } from '@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus';
import { WebHostingWebsiteDomainType } from '@/data/types/product/webHosting';
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
  const multisiteUrl = useGenerateUrl(`/${serviceName}/multisite`, 'path');
  const hostingUrl = useHostingUrl(serviceName);
  const boostUrl = useHostingUrl(serviceName, 'boost');
  if (withMultisite) {
    return `/#/web-hosting${multisiteUrl}`;
  }
  if (withBoost) {
    return boostUrl;
  }
  return hostingUrl;
};

const getDnsStatusAndTooltip = (type: 'A' | 'AAAA', data: WebSiteAttachedDomainDigStatusType) => {
  const records = Object.values(data.records).filter((r) => r.type === type);
  const recommendedIps =
    type === 'A' ? data.recommendedIps.recommendedIpV4 : data.recommendedIps.recommendedIpV6;

  if (!records.length) {
    return {
      status: DnsStatus.NOT_CONFIGURED,
      tooltipKey: 'multisite:multisite_tooltip_diagnostic_unconfigured',
      ip: '',
    };
  }

  let hasValidRecord = false;
  let ipFound = '';

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
    const hasExternalRecord = records.some((r) => !r.isOvhIp);
    if (hasExternalRecord) {
      status = DnsStatus.EXTERNAL;
      const externalIp = Object.keys(data.records).find((ip) => data.records[ip].type === type);
      ipFound = externalIp || '';
      tooltipKey = 'multisite:multisite_tooltip_diagnostic_not_good_configuration';
    } else {
      status = DnsStatus.NOT_CONFIGURED;
      tooltipKey = 'multisite:multisite_tooltip_diagnostic_unconfigured';
    }
  }

  return { status, tooltipKey, ip: ipFound };
};

interface DiagnosticCellProps {
  serviceName: string;
  fqdn: string;
  isWebsiteView?: boolean;
}

export const DiagnosticCell = ({ serviceName, fqdn, isWebsiteView }: DiagnosticCellProps) => {
  const { t } = useTranslation('common');
  const hostingUrl = useHostingUrlWithOptions(serviceName, true, false);

  const { data, isLoading, isError, refetch } = useWebHostingAttachedDomaindigStatus(
    serviceName,
    fqdn,
  );

  if (isError) {
    return (
      <OdsButton
        label={t('web_hosting_status_diagnostic_error')}
        icon={ODS_ICON_NAME.refresh}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.critical}
        onClick={() => {
          refetch().catch(console.error);
        }}
      />
    );
  }

  return ['A', 'AAAA'].map((type) => {
    const { status, tooltipKey, ip } =
      !isLoading && data
        ? getDnsStatusAndTooltip(type as 'A' | 'AAAA', data)
        : { status: DnsStatus.NOT_CONFIGURED, tooltipKey: '', ip: '' };

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
      <>
        <OdsBadge
          className="mr-4"
          id={`diagnostic-status-${type}-${fqdn}`}
          label={type}
          color={getStatusColor(status)}
        />
        <OdsTooltip
          triggerId={`diagnostic-status-${type}-${fqdn}`}
          position={ODS_TOOLTIP_POSITION.topStart}
        >
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(tooltipKey, { domainName: fqdn, ip })}
          </OdsText>
        </OdsTooltip>
      </>
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
    <Links
      label={label}
      href={hostingUrl}
      onClickReturn={() =>
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: [`${DATAGRID_LINK}${tracking}_${WEBSITE}`],
        })
      }
      target="_blank"
    />
  );
};
