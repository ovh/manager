import React, { useEffect, useContext, useMemo, useState } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  ChangelogButton,
  GuideButton,
  GuideItem,
  OvhSubsidiary,
  PageLayout,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsInput,
  OdsMessage,
  OdsTab,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';

import {
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import {
  useGetHostingService,
  useUpdateHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { EmailOptionType } from '@/data/type';
import { useHostingUrl, useEmailsUrl } from '@/hooks';
import { GUIDE_URL } from '../websites/websites.constants';
import { DashboardTab } from '@/types/ssl';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import ExpirationDate from '@/components/expirationDate/ExpirationDate.component';
import Tabs from '@/components/tabs/Tabs.component';

export default function Layout() {
  const { shell } = useContext(ShellContext);
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');

  const { data } = useGetHostingService(serviceName);
  const { flattenData } = useResourcesIcebergV6<EmailOptionType>({
    route: `/hosting/web/${serviceName}/emailOption`,
    queryKey: ['hosting', 'web', serviceName, 'emailOption'],
  });
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [editDisplayName, setEditDisplayName] = useState<boolean>(false);
  const [onUpdateError, setOnUpdateError] = useState<boolean>(false);

  const { pathname: path } = useLocation();

  const tabs: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('hosting_tab_GENERAL_INFORMATIONS'),
      to: useHostingUrl(serviceName),
    },
    {
      name: 'multisite',
      title: t('hosting_tab_MULTISITE'),
      to: useHostingUrl(serviceName, 'multisite'),
    },
    {
      name: 'ssl',
      title: t('hosting_tab_SSL'),
      to: useResolvedPath('ssl').pathname,
    },
    {
      name: 'module',
      title: t('hosting_tab_MODULE'),
      to: useHostingUrl(serviceName, 'module'),
    },
    {
      name: 'logs',
      title: t('hosting_tab_USER_LOGS'),
      to: useHostingUrl(serviceName, 'user-logs'),
    },
    {
      name: 'ftp',
      title: t('hosting_tab_FTP'),
      to: useHostingUrl(serviceName, 'ftp'),
    },
    {
      name: 'database',
      title: t('hosting_tab_DATABASE'),
      to: useHostingUrl(serviceName, 'database'),
    },
    {
      name: 'task',
      title: t('hosting_tab_TASK'),
      to: useHostingUrl(serviceName, 'task'),
    },
    {
      name: 'automated_email',
      title: t('hosting_tab_AUTOMATED_EMAILS'),
      to: useHostingUrl(serviceName, 'automated-emails'),
    },
    {
      name: 'cron',
      title: t('hosting_tab_CRON'),
      to: useHostingUrl(serviceName, 'cron'),
    },
    {
      name: 'seo',
      title: t('hosting_tab_LOCAL_SEO'),
      to: useHostingUrl(serviceName, 'localSeo'),
    },
    {
      name: 'boost',
      title: t('hosting_tab_BOOST'),
      to: useHostingUrl(serviceName, 'boost'),
    },
    {
      name: 'mails',
      title: t('domain_tab_emails'),
      to: useEmailsUrl(flattenData?.[0]?.domain, 'mailing-list'),
    },
  ];

  useRouteSynchro();

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.to === path);
  }, [tabs, path]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  const { updateHostingService } = useUpdateHostingService(
    serviceName,
    () => {
      setOnUpdateError(false);
    },
    () => {
      setOnUpdateError(true);
    },
  );

  const onConfirm = () => {
    updateHostingService({ displayName: newDisplayName });
    setEditDisplayName(!editDisplayName);
  };

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: GUIDE_URL[ovhSubsidiary as OvhSubsidiary] || GUIDE_URL.DEFAULT,
      target: '_blank',
      label: t('web_hosting_header_guide_general_informations'),
    },
  ];

  return (
    <PageLayout>
      <Breadcrumb />
      <div className="flex items-center justify-between mt-10">
        {editDisplayName ? (
          <div className="w-2/3 mb-4">
            <OdsInput
              className="w-2/3"
              name="edit-detail"
              type="text"
              defaultValue={data?.displayName || data?.serviceName}
              onOdsChange={(e) => setNewDisplayName(e.target.value as string)}
              ariaLabel="edit-input"
            />
            <OdsButton
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.check}
              onClick={onConfirm}
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
        <div className="flex flex-wrap gap-5 justify-end">
          <ChangelogButton links={CHANGELOG_LINKS} />
          <GuideButton items={guideItems} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-7">
        <OdsText>{data?.serviceName}</OdsText>
        <div className="flex flex-wrap justify-end">
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
      <ExpirationDate />
      {onUpdateError && (
        <OdsMessage
          className="mb-10 w-full"
          color={ODS_MESSAGE_COLOR.warning}
          isDismissible
          onOdsRemove={() => {
            setOnUpdateError(false);
          }}
        >
          {t('hosting_dashboard_loading_error')}
        </OdsMessage>
      )}
      <div className=" mt-8 mb-6">
        <Tabs>
          {tabs.map((tab: DashboardTab) => (
            <a href={tab.to} className="no-underline" key={tab.name}>
              <OdsTab isSelected={tab.name === activeTab?.name} role="tab">
                {tab.title}
              </OdsTab>
            </a>
          ))}
        </Tabs>
      </div>
      <Outlet />
    </PageLayout>
  );
}
