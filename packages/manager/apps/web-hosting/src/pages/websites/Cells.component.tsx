import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { Links } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BadgeStatus } from '@/components/badgeStatus/BadgeStatus.component';
import { useWebHostingAttachedDomaindigStatus } from '@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus';
import { WebsiteType } from '@/data/types/product/website';
import { DnsStatus, GitStatus, ServiceStatus } from '@/data/types/status';
import { useHostingUrl } from '@/hooks/useHostingUrl';
import { DATAGRID_LINK, DIAGNOSTIC, WEBSITE } from '@/utils/tracking.constants';

const useHostingUrlWithOptions = (
  serviceName: string,
  withMultisite = false,
  withBoost = false,
) => {
  let option;
  if (withMultisite) {
    option = 'multisite';
  } else if (withBoost) {
    option = 'boost';
  }
  return useHostingUrl(serviceName, option);
};

export const DiagnosticCell = ({ webSiteItem }: { webSiteItem: WebsiteType }) => {
  const { t } = useTranslation('common');
  const hostingUrl = useHostingUrlWithOptions(
    webSiteItem?.currentState.hosting.serviceName || '',
    true,
    false,
  );

  const { data, isLoading, isError, refetch } = useWebHostingAttachedDomaindigStatus(
    webSiteItem?.currentState.hosting.serviceName,
    webSiteItem?.currentState.fqdn,
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
    let status = DnsStatus.NOT_CONFIGURED;
    let recommendedIps: string[];
    let records: {
      type: string;
      dnsConfigured: boolean;
      isOvhIp: boolean;
    }[];

    if (!isLoading && data) {
      records = Object.values(data.records).filter((r) => r.type === type);
      recommendedIps =
        type === 'A'
          ? data.recommendedIps?.recommendedIpV4 || []
          : data.recommendedIps?.recommendedIpV6 || [];

      if (records.length > 0) {
        const hasValidRecord = records.some((record) => {
          if (record.dnsConfigured && record?.isOvhIp) {
            const recordIp = Object.keys(data.records).find(
              (ip) => data.records[ip].type === type && data.records[ip] === record,
            );
            return recordIp && recommendedIps.includes(recordIp);
          }
          return false;
        });

        if (hasValidRecord) {
          status = DnsStatus.CONFIGURED;
        } else {
          const hasExternalRecord = records.some((record) => record?.isOvhIp === false);
          status = hasExternalRecord ? DnsStatus.EXTERNAL : DnsStatus.NOT_CONFIGURED;
        }
      }
    }

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
  });
};

interface BadgeStatusCellProps {
  webSiteItem: WebsiteType;
  status: ServiceStatus | GitStatus;
  tracking?: string;
  withMultisite?: boolean;
  withBoost?: boolean;
}

export const BadgeStatusCell = ({
  webSiteItem,
  status,
  tracking,
  withMultisite = false,
  withBoost = false,
}: BadgeStatusCellProps) => {
  const hostingUrl = useHostingUrlWithOptions(
    webSiteItem?.currentState.hosting.serviceName,
    withMultisite,
    withBoost,
  );

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
