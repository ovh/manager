import { useEffect, useMemo } from 'react';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsBadge } from '@ovhcloud/ods-components/react';

import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';

import { getStatusColor } from '@/components/badgeStatus/BadgeStatus.component';
import { useWebHostingWebsiteDomain } from '@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain';
import { WebHostingWebsiteDomainType } from '@/data/types/product/webHosting';
import { DiagnosticCell } from '@/pages/websites/Cells.component';

import ActionButtonMultisite from './ActionButtonMultisite.component';

export const DatagridSubComponent = ({
  serviceName,
  siteId,
  headerRefs,
}: {
  serviceName: string;
  siteId: string;
  headerRefs: React.MutableRefObject<Record<string, HTMLTableCellElement>>;
}) => {
  const { data, isLoading, refetch } = useWebHostingWebsiteDomain(serviceName, siteId) as {
    data?: WebHostingWebsiteDomainType[];
    isLoading: boolean;
    refetch: () => void;
  };
  const { t } = useTranslation('common');

  useEffect(() => {
    void refetch();
  }, [siteId, refetch]);
  const domainColumns: DatagridColumn<WebHostingWebsiteDomainType>[] = useMemo(() => {
    const getColumnWidth = (id: string) => headerRefs.current[id]?.clientWidth || 100;

    return [
      {
        id: 'site',
        label: '',
        size: getColumnWidth('site'),
        cell: () => <div></div>,
      },
      {
        id: 'linkedDomains',
        label: '',
        size: getColumnWidth('linkedDomains'),
        cell: (item: WebHostingWebsiteDomainType) => <div>{item.currentState?.fqdn}</div>,
      },
      {
        id: 'path',
        label: '',
        size: getColumnWidth('path'),
        cell: () => <div></div>,
      },
      {
        id: 'git',
        label: '',
        size: getColumnWidth('git'),
        cell: () => <div></div>,
      },
      {
        id: 'firewall',
        label: '',
        size: getColumnWidth('firewall'),
        cell: (item: WebHostingWebsiteDomainType) => (
          <OdsBadge
            data-testid={`badge-status-${item.currentState?.firewall.status}`}
            color={getStatusColor(item.currentState?.firewall.status)}
            label={t(`web_hosting_status_${item.currentState?.firewall.status.toLowerCase()}`)}
          />
        ),
      },
      {
        id: 'CDN',
        label: '',
        size: getColumnWidth('CDN'),
        cell: (item: WebHostingWebsiteDomainType) => (
          <OdsBadge
            data-testid={`badge-status-${item.currentState?.cdn.status}`}
            color={getStatusColor(item.currentState?.cdn.status)}
            label={t(`web_hosting_status_${item.currentState?.cdn.status.toLowerCase()}`)}
          />
        ),
      },
      {
        id: 'diagnostic',
        size: getColumnWidth('diagnostic'),
        label: '',
        cell: (item) => <DiagnosticCell serviceName={serviceName} fqdn={item.currentState.fqdn} />,
      },
      {
        id: 'actions',
        label: '',
        size: getColumnWidth('actions'),
        cell: (item: WebHostingWebsiteDomainType) => (
          <ActionButtonMultisite
            context="domain"
            domainId={item.id}
            domain={item.currentState?.fqdn}
            site={item.currentState?.name ?? ''}
            path={item.currentState?.path ?? ''}
            domains={data}
          />
        ),
      },
    ];
  }, [headerRefs, serviceName, t, data]);

  return (
    <Datagrid
      columns={domainColumns}
      items={data || []}
      totalItems={data?.length || 0}
      isLoading={isLoading}
      hideHeader
      tableLayoutFixed={true}
      className="sub-row"
    />
  );
};
