import { useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BADGE_ICON_ALIGNMENT,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_TOOLTIP_POSITION,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { Datagrid, DatagridColumn, ManagerButton } from '@ovh-ux/manager-react-components';

import { getStatusColor } from '@/components/badgeStatus/BadgeStatus.component';
import { useWebHostingWebsite } from '@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite';
import { WebHostingWebsiteType } from '@/data/types/product/webHosting';
import { GIT_STATUS_WITH_TOOLTIP } from '@/data/types/status';
import { useOverridePage } from '@/hooks/overridePage/useOverridePage';
import { subRoutes, urls } from '@/routes/routes.constants';

import ActionButtonMultisite from './component/ActionButtonMultisite.component';
import { DatagridSubComponent } from './component/DatagridSubComponent.component';

export default function MultisitePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'multisite']);
  const isOverridedPage = useOverridePage();
  const navigate = useNavigate();

  const { data: websites = [], isLoading } = useWebHostingWebsite(serviceName) as {
    data?: WebHostingWebsiteType[];
    isLoading: boolean;
  };

  const columns: DatagridColumn<WebHostingWebsiteType>[] = useMemo(
    () => [
      {
        id: 'site',
        label: 'Site',
        isSortable: true,
        cell: (item) => (
          <>
            <div>
              {item.currentState?.name}
              <ManagerButton
                className="ml-2"
                id={'edit-name'}
                label={''}
                variant={ODS_BUTTON_VARIANT.ghost}
                color={ODS_BUTTON_COLOR.primary}
                onClick={() =>
                  navigate('./edit-name', {
                    state: { siteName: item.currentState?.name, siteId: item.id },
                  })
                }
                icon={ODS_ICON_NAME.pen}
              />
            </div>
          </>
        ),
      },
      {
        id: 'linkedDomains',
        label: t('web_hosting_status_header_linked_domains'),
        isSortable: false,
        cell: (item) => <span>{item.currentState?.linkedDomains}</span>,
      },
      {
        id: 'path',
        label: t('web_hosting_status_header_path'),
        isSortable: true,
        cell: (item) => <div>{item.currentState?.path}</div>,
      },
      {
        id: 'git',
        label: t('web_hosting_status_header_git'),
        isSortable: true,
        cell: (item) => {
          const status = item.currentState?.git.status;
          const tooltipKey =
            GIT_STATUS_WITH_TOOLTIP[status as keyof typeof GIT_STATUS_WITH_TOOLTIP] || 'lastdeploy';

          return (
            <>
              <OdsBadge
                id={`git-status-${item.id}`}
                iconAlignment={ODS_BADGE_ICON_ALIGNMENT.right}
                color={getStatusColor(status)}
                label={t(`web_hosting_status_${status?.toLowerCase()}`)}
              />
              <OdsTooltip triggerId={`git-status-${item.id}`} position={ODS_TOOLTIP_POSITION.right}>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t(`multisite:multisite_git_state_tooltip_${tooltipKey}`)}
                </OdsText>
              </OdsTooltip>
            </>
          );
        },
      },
      {
        id: 'firewall',
        label: t('web_hosting_status_header_firewall'),
        cell: () => <div></div>,
      },
      {
        id: 'CDN',
        label: t('web_hosting_status_header_cdn'),
        cell: () => <div></div>,
      },
      {
        id: 'diagnostic',
        label: t('web_hosting_status_header_diagnostic'),
        cell: () => <div></div>,
      },
      {
        id: 'actions',
        label: '',
        cell: (item) => (
          <ActionButtonMultisite
            context="site"
            siteId={item.id}
            site={item.currentState?.name}
            path={item.currentState?.path}
          />
        ),
      },
    ],

    [navigate, t],
  );

  return (
    <>
      {!isOverridedPage && (
        <Datagrid
          columns={columns}
          items={websites}
          totalItems={websites.length}
          isLoading={isLoading}
          topbar={
            <ManagerButton
              id="add-website"
              data-testid="add-website-button"
              label={t('add_website')}
              onClick={() => navigate(urls.addWebSite.replace(subRoutes.serviceName, serviceName))}
            />
          }
          getRowCanExpand={(row) => !!row.original.currentState?.linkedDomains}
          renderSubComponent={(row, refs) => {
            const siteId = row.original.id;
            if (siteId === undefined) return null;
            return (
              <DatagridSubComponent
                key={siteId}
                serviceName={serviceName}
                siteId={siteId}
                headerRefs={refs}
              />
            );
          }}
        />
      )}
      <Outlet />
    </>
  );
}
