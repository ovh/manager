import { useMemo } from 'react';
import {
  ActionMenu,
  Datagrid,
  DatagridColumn,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressWebsites } from '@/data/type';
import { BadgeStatus } from '@/components/badgeStatus/BadgeStatus.component';
import { useGenerateUrl } from '@/hooks';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};
export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};
export default function MyWebsitesPage() {
  const { t } = useTranslation([
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
  ]);
  const { serviceName } = useParams();
  const { data } = useManagedWordpressWebsites(serviceName);
  const columns: DatagridColumn<ManagedWordpressWebsites>[] = useMemo(
    () => [
      {
        id: 'defaultFQDN',
        cell: (item) => {
          return (
            <div>
              {!item.currentState.defaultFQDN
                ? t('common:web_hosting_status_creating_label')
                : item.currentState.defaultFQDN}
            </div>
          );
        },
        label: t('common:web_hosting_status_header_fqdn'),
        isSortable: true,
      },
      {
        id: 'resourceStatus',
        cell: (item) => <BadgeStatus itemStatus={item.resourceStatus} />,
        label: t(`${NAMESPACES.STATUS}:status`),
        isSortable: true,
      },
      {
        id: 'delete',
        cell: (item) => {
          return (
            <ActionMenu
              items={[
                {
                  id: 1,
                  label: t(`${NAMESPACES.ACTIONS}:delete`),
                  onClick: () => {
                    // Handle delete action
                  },
                  color: ODS_BUTTON_COLOR.critical,
                },
              ]}
              isCompact
              variant={ODS_BUTTON_VARIANT.ghost}
              id={item.id}
            />
          );
        },
        label: '',
        isSortable: true,
        enableHiding: false,
      },
    ],
    [],
  );

  const importPage = useGenerateUrl(`./import`, 'href');

  const handleImportClick = () => {
    window.location.href = importPage;
  };

  return (
    <Datagrid
      columns={columns}
      items={data || []}
      totalItems={data?.length || 0}
      topbar={
        <div className="flex items-center justify-between">
          <div className="flex gap-4 m-4">
            <ManagerButton
              id={'my-websites-create'}
              label={t(`${NAMESPACES.ACTIONS}:create`)}
            ></ManagerButton>
            <ManagerButton
              id={'my-websites-import'}
              label={t('common:web_hosting_action_import')}
              variant={ODS_BUTTON_VARIANT.outline}
              onClick={handleImportClick}
            ></ManagerButton>
            <ManagerButton
              id={'my-websites-manage'}
              isDisabled
              label={t('common:web_hosting_action_manage_my_sites')}
              icon={ODS_ICON_NAME.externalLink}
            ></ManagerButton>
          </div>
        </div>
      }
    ></Datagrid>
  );
}
