import { Suspense, useMemo, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { ExpandedState } from '@tanstack/react-table';
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

import { Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { getStatusColor } from '@/components/badgeStatus/BadgeStatus.component';
import { useWebHostingAttachedDomain } from '@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain';
import { useWebHostingWebsite } from '@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite';
import { useWebHostingWebsiteDomains } from '@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain';
import {
  WebHostingWebsiteDomainType,
  WebHostingWebsiteType,
} from '@/data/types/product/webHosting';
import { GIT_STATUS_WITH_TOOLTIP, GitStatus, ServiceStatus } from '@/data/types/status';
import { useOverridePage } from '@/hooks/overridePage/useOverridePage';
import { DiagnosticCell } from '@/pages/websites/Cells.component';
import { subRoutes, urls } from '@/routes/routes.constants';

import ActionButtonMultisite from './component/ActionButtonMultisite.component';

type CombinedRowType = (WebHostingWebsiteType | WebHostingWebsiteDomainType) & {
  subRows?: WebHostingWebsiteDomainType[];
};

const isDomain = (row: CombinedRowType): row is WebHostingWebsiteDomainType => {
  return 'currentState' in row && 'fqdn' in (row.currentState || {});
};

export default function MultisitePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'multisite']);
  const isOverridedPage = useOverridePage();
  const navigate = useNavigate();

  const { data: websites, isLoading: isLoadingWebsites } = useWebHostingWebsite(serviceName);

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const domainQueries = useWebHostingWebsiteDomains(serviceName, websites);
  const { data: domainsAttached = [] } = useWebHostingAttachedDomain({ domain: serviceName });
  const isLoadingDomains = domainQueries.some((query) => query.isLoading);
  const isLoading = isLoadingWebsites || isLoadingDomains;

  const domainsData = domainQueries.map((query) => query.data ?? []);

  const combinedData: CombinedRowType[] = useMemo(() => {
    if (!websites) return [];

    return websites.map((website, index) => {
      const domains = domainsData[index] ?? [];
      const hasLinkedDomains = (website.currentState?.linkedDomains ?? 0) > 0;

      return {
        ...website,

        subRows: hasLinkedDomains ? (domains.length > 0 ? domains : []) : undefined,
      } as CombinedRowType;
    });
  }, [websites, domainsData]);

  const columns: DatagridColumn<CombinedRowType>[] = useMemo(
    () => [
      {
        id: 'site',
        header: 'Site',
        accessorFn: (row) => {
          if (isDomain(row)) {
            return row.currentState?.name ?? '';
          }
          return (row as WebHostingWebsiteType).currentState?.name ?? '';
        },
        cell: ({ row, getValue }) => {
          if (isDomain(row.original)) {
            return <div>{getValue<string>()}</div>;
          }

          return (
            <>
              <div>
                {getValue<string>()}
                <Button
                  className="ml-2"
                  id={'edit-name'}
                  data-testid="edit-name"
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.primary}
                  onClick={() =>
                    navigate('./edit-name', {
                      state: {
                        siteName: getValue<string>(),
                        siteId: row.original.id,
                      },
                    })
                  }
                >
                  <Icon name={ICON_NAME.pen} />
                </Button>
              </div>
            </>
          );
        },
      },
      {
        id: 'linkedDomains',
        accessorFn: (row) => {
          if (isDomain(row)) {
            return row.currentState?.fqdn ?? '';
          }
          return (row as WebHostingWebsiteType).currentState?.linkedDomains ?? '';
        },
        header: t('web_hosting_status_header_linked_domains'),
        isSortable: false,
        cell: ({ getValue, row }) => {
          if (isDomain(row.original)) {
            return <div>{getValue<string>()}</div>;
          }

          return (
            <span>
              {t(`multisite:multisite_linked_${getValue<number>() > 1 ? 'domains' : 'domain'}`, {
                linkedDomains: getValue<number>(),
              })}
            </span>
          );
        },
      },
      {
        id: 'path',
        accessorFn: (row) => row.currentState?.path ?? '',
        header: t('web_hosting_status_header_path'),
        cell: ({ getValue }) => <div>{getValue<string>()}</div>,
      },
      {
        id: 'git',
        accessorFn: (row) => {
          if (isDomain(row)) {
            return '';
          }
          return (row as WebHostingWebsiteType).currentState?.git?.status ?? '';
        },
        header: t('web_hosting_status_header_git'),
        cell: ({ getValue, row }) => {
          if (isDomain(row.original)) {
            return <div></div>;
          }

          const status = getValue<GitStatus>();
          if (!status) return <div></div>;

          const tooltipKey =
            GIT_STATUS_WITH_TOOLTIP[status as keyof typeof GIT_STATUS_WITH_TOOLTIP] || 'lastdeploy';

          return (
            <>
              <Tooltip position={TOOLTIP_POSITION.right}>
                <TooltipTrigger asChild>
                  <Badge id={`git-status-${row.original.id}`} color={getStatusColor(status)}>
                    {t(`web_hosting_status_${status?.toLowerCase()}`)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {t(`multisite:multisite_git_state_tooltip_${tooltipKey}`)}
                </TooltipContent>
              </Tooltip>
            </>
          );
        },
      },
      {
        id: 'firewall',
        accessorFn: (row) => {
          if (isDomain(row)) {
            return row.currentState?.firewall?.status ?? '';
          }
          return '';
        },
        header: t('web_hosting_status_header_firewall'),
        cell: ({ getValue, row }) => {
          if (isDomain(row.original)) {
            const status = getValue<ServiceStatus>();
            if (!status) return <div></div>;
            return (
              <Badge data-testid={`badge-status-${status}`} color={getStatusColor(status)}>
                {t(`web_hosting_status_${status.toLowerCase()}`)}
              </Badge>
            );
          }
          return <div></div>;
        },
      },
      {
        id: 'CDN',
        accessorFn: (row) => {
          if (isDomain(row)) {
            return row.currentState?.cdn?.status ?? '';
          }
          return '';
        },
        header: t('web_hosting_status_header_cdn'),
        cell: ({ getValue, row }) => {
          if (isDomain(row.original)) {
            const status = getValue<ServiceStatus>();
            if (!status) return <div></div>;
            return (
              <Badge data-testid={`badge-status-${status}`} color={getStatusColor(status)}>
                {t(`web_hosting_status_${status.toLowerCase()}`)}
              </Badge>
            );
          }
          return <div></div>;
        },
      },
      {
        id: 'diagnostic',
        accessorFn: (row) => {
          if (isDomain(row)) {
            return row.currentState?.fqdn ?? '';
          }
          return '';
        },
        header: t('web_hosting_status_header_diagnostic'),
        cell: ({ getValue, row }) => {
          if (isDomain(row.original)) {
            const fqdn = getValue<string>();
            if (!fqdn || !serviceName) return <div></div>;
            return <DiagnosticCell serviceName={serviceName} fqdn={fqdn} />;
          }
          return <div></div>;
        },
      },
      {
        id: 'actions',
        accessorFn: () => '',
        header: '',
        size: 48,
        cell: ({ row }) => {
          if (isDomain(row.original)) {
            const domain = row.original;
            const allDomains =
              domainsData.find((domains) => domains.some((d) => d.id === domain.id)) ?? [];

            return (
              <ActionButtonMultisite
                context="domain"
                domainId={domain.id}
                domain={domain.currentState?.fqdn}
                siteId={domain?.currentState?.websiteId ?? ''}
                site={domain.currentState?.name ?? ''}
                path={domain.currentState?.path ?? ''}
                domains={allDomains}
                isDisabled={domainsAttached.some((d) => {
                  return (
                    d.currentState?.fqdn === domain.currentState.fqdn &&
                    d.currentState?.isDefault === true
                  );
                })}
              />
            );
          }

          const website = row.original as WebHostingWebsiteType;
          return (
            <ActionButtonMultisite
              context="site"
              siteId={website.id}
              site={website.currentState?.name}
              path={website.currentState?.path}
            />
          );
        },
      },
    ],

    [t, navigate, serviceName, domainsData, domainsAttached],
  );

  return (
    <>
      {!isOverridedPage && (
        <Datagrid
          columns={columns}
          data={combinedData || []}
          isLoading={isLoading}
          autoScroll={false}
          containerHeight={500}
          topbar={
            <Button
              id="add-website"
              data-testid="add-website-button"
              onClick={() => navigate(urls.addWebSite.replace(subRoutes.serviceName, serviceName))}
            >
              {t('add_website')}
            </Button>
          }
          expandable={{
            expanded,
            setExpanded,
            getRowCanExpand: (row) => {
              if (isDomain(row.original)) {
                return false;
              }
              const website = row.original as WebHostingWebsiteType;
              return (website.currentState?.linkedDomains ?? 0) > 0;
            },
          }}
        />
      )}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}
