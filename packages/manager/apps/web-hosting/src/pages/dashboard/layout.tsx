import React, { useEffect, useContext, useMemo, useState } from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  ChangelogButton,
  PageLayout,
} from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsInput,
  OdsTab,
  OdsTabs,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';

import {
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useGetHostingService } from '@/data/hooks/useDashboard';
import { DashboardTab } from '@/types/ssl';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

export default function Layout() {
  const { shell } = useContext(ShellContext);
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');

  const { data } = useGetHostingService(serviceName);
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [editDisplayName, setEditDisplayName] = useState<boolean>(false);

  const { pathname: path } = useLocation();

  const tabs: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('hosting_tab_GENERAL_INFORMATIONS'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'multisite',
      title: t('hosting_tab_MULTISITE'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'ssl',
      title: t('hosting_tab_SSL'),
      to: useResolvedPath('ssl').pathname,
    },
    {
      name: 'module',
      title: t('hosting_tab_MODULE'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'logs',
      title: t('hosting_tab_USER_LOGS'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'ftp',
      title: t('hosting_tab_FTP'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'database',
      title: t('hosting_tab_DATABASE'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'task',
      title: t('hosting_tab_TASK'),
      to: useResolvedPath('').pathname,
    },
  ];

  useRouteSynchro();

  const activeTab = useMemo(() => {
    const getActiveTab = () => tabs.find((tab) => tab.to === path);

    return getActiveTab();
  }, [tabs, path]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <PageLayout>
      <Breadcrumb />
      <div className="flex items-center justify-between">
        {editDisplayName ? (
          <div>
            <OdsInput
              name="edit-detail"
              type="text"
              defaultValue={data?.displayName || data?.serviceName}
              onOdsChange={(e) => setNewDisplayName(e.target.value as string)}
              ariaLabel="edit-input"
            />
            <OdsButton
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.check}
              label=""
            ></OdsButton>
            <OdsButton
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.xmark}
              label=""
              onClick={() => setEditDisplayName(!editDisplayName)}
            ></OdsButton>
          </div>
        ) : (
          <div>
            <OdsText preset={ODS_TEXT_PRESET.heading1}>
              {data?.displayName || data?.serviceName}
            </OdsText>
            <OdsButton
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.pen}
              label=""
              onClick={() => setEditDisplayName(!editDisplayName)}
            ></OdsButton>
          </div>
        )}
        <div className="flex flex-wrap justify-end">
          <ChangelogButton links={CHANGELOG_LINKS} />
          <ActionMenu
            id="add_domain"
            items={[
              {
                id: 1,
                label: t('hosting_action_add_domain'),
                onClick: () => {},
              },
            ]}
          />
        </div>
      </div>
      <div className="mb-6">
        <OdsTabs>
          {tabs.map((tab: DashboardTab) => (
            <NavLink to={tab.to} className="no-underline" key={tab.name}>
              <OdsTab isSelected={tab.name === activeTab?.name}>
                {tab.title}
              </OdsTab>
            </NavLink>
          ))}
        </OdsTabs>
      </div>
      <Outlet />
    </PageLayout>
  );
}
