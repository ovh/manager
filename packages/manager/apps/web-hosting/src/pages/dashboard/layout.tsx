import { useContext, useEffect, useMemo, useState } from 'react';

import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  BUTTON_VARIANT,
  Badge,
  Button,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  MESSAGE_COLOR,
  Message,
  TEXT_PRESET,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { ShellContext, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ChangelogMenu,
  GuideMenu,
  Notifications,
  OvhSubsidiary,
  useDataApi,
} from '@ovh-ux/muk';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import ExpirationDate from '@/components/expirationDate/ExpirationDate.component';
import {
  useGetHostingService,
  useUpdateHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { EmailOptionType } from '@/data/types/product/service';
import { DashboardTab } from '@/data/types/product/ssl';
import { useHostingUrl } from '@/hooks';
import { useOverridePage } from '@/hooks/overridePage/useOverridePage';
import { useEmailsUrl } from '@/hooks/useEmailsUrl';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

import { GUIDE_URL } from '../websites/constant/websites.constants';

export default function Layout() {
  const { shell } = useContext(ShellContext);
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const isOverridedPage = useOverridePage();
  const { data } = useGetHostingService(serviceName);
  const { data: availability } = useFeatureAvailability([
    'web-hosting:multisite-react',
    'web-hosting:osl-to-ldp',
  ]);

  const { flattenData } = useDataApi<EmailOptionType>({
    version: 'v6',
    route: `/hosting/web/${serviceName}/emailOption`,
    cacheKey: ['hosting', 'web', serviceName, 'emailOption'],
  });

  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [editDisplayName, setEditDisplayName] = useState<boolean>(false);
  const [onUpdateError, setOnUpdateError] = useState<boolean>(false);

  const { pathname, hash } = useLocation();

  const generalUrl = useHostingUrl(serviceName);
  const multisiteHostingUrl = useHostingUrl(serviceName, 'multisite');
  const multisiteUrl = availability?.['web-hosting:multisite-react']
    ? `#/${serviceName}/multisite`
    : multisiteHostingUrl;
  const sslPathname = `#/${serviceName}/ssl`;
  const logsUrl = `#/${serviceName}/user-logs`;
  const ftpUrl = useHostingUrl(serviceName, 'ftp');
  const databaseUrl = useHostingUrl(serviceName, 'database');
  const moduleUrl = useHostingUrl(serviceName, 'module');
  const taskUrl = `#/${serviceName}/task`;
  const automatedEmailsUrl = useHostingUrl(serviceName, 'automated-emails');
  const cronUrl = useHostingUrl(serviceName, 'cron');
  const seoUrl = `#/${serviceName}/localSeo`;
  const boostUrl = useHostingUrl(serviceName, 'boost');
  const mailsUrl = useEmailsUrl(flattenData?.[0]?.domain, 'mailing-list');

  if (pathname === `/${serviceName}`) {
    window.location.replace(generalUrl);
  }

  const tabs: DashboardTab[] = useMemo(
    () => [
      {
        name: 'general_information',
        title: t('hosting_tab_GENERAL_INFORMATIONS'),
        to: generalUrl,
      },
      {
        name: 'multisite',
        title: availability?.['web-hosting:multisite-react']
          ? t('hosting_tab_WEBSITE')
          : t('hosting_tab_MULTISITE'),
        to: multisiteUrl,
      },
      {
        name: 'ssl',
        title: t('hosting_tab_SSL'),
        to: sslPathname,
      },
      {
        name: 'module',
        title: t('hosting_tab_MODULE'),
        to: moduleUrl,
      },
      ...(availability?.['web-hosting:osl-to-ldp']
        ? [
            {
              name: 'logs',
              title: t('hosting_tab_USER_LOGS'),
              to: logsUrl,
              badge: {
                label: 'Beta',
                color: 'success' as const,
              },
            },
          ]
        : []),
      {
        name: 'ftp',
        title: t('hosting_tab_FTP'),
        to: ftpUrl,
      },
      {
        name: 'database',
        title: t('hosting_tab_DATABASE'),
        to: databaseUrl,
      },
      {
        name: 'task',
        title: t('hosting_tab_TASK'),
        to: taskUrl,
      },
      {
        name: 'automated_email',
        title: t('hosting_tab_AUTOMATED_EMAILS'),
        to: automatedEmailsUrl,
      },
      {
        name: 'cron',
        title: t('hosting_tab_CRON'),
        to: cronUrl,
      },
      {
        name: 'seo',
        title: t('hosting_tab_LOCAL_SEO'),
        to: seoUrl,
      },
      {
        name: 'boost',
        title: t('hosting_tab_BOOST'),
        to: boostUrl,
      },
      {
        name: 'mails',
        title: t('domain_tab_emails'),
        to: mailsUrl,
      },
    ],
    [
      availability,
      t,
      generalUrl,
      availability,
      multisiteUrl,
      sslPathname,
      moduleUrl,
      logsUrl,
      ftpUrl,
      databaseUrl,
      taskUrl,
      automatedEmailsUrl,
      cronUrl,
      seoUrl,
      boostUrl,
      mailsUrl,
    ],
  );

  useRouteSynchro();
  const getComparablePath = (tabUrl: string | null | undefined): string => {
    const safeUrl = tabUrl ?? '';
    return safeUrl.startsWith('#') ? safeUrl.slice(1) : safeUrl;
  };
  const activeTab = useMemo(() => {
    const currentPath = hash ? hash : pathname;

    return tabs.find((tab) => getComparablePath(tab.to) === currentPath);
  }, [tabs, pathname, hash]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell]);

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

  const guideItems = [
    {
      id: 1,
      href: GUIDE_URL[ovhSubsidiary as OvhSubsidiary] || GUIDE_URL.DEFAULT,
      target: '_blank',
      children: t('web_hosting_header_guide_general_informations'),
    },
  ];

  return (
    <BaseLayout breadcrumb={<Breadcrumb />}>
      <div className="mt-10 flex items-center justify-between">
        {editDisplayName ? (
          <div className="mb-4 w-2/3">
            <Input
              className="w-2/3"
              name="edit-detail"
              type={INPUT_TYPE.text}
              defaultValue={data?.displayName || data?.serviceName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              aria-label="edit-input"
            />
            <Button variant={BUTTON_VARIANT.ghost} onClick={onConfirm}>
              <Icon name={ICON_NAME.check} aria-hidden="true" />
            </Button>
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={() => setEditDisplayName(!editDisplayName)}
            >
              <Icon name={ICON_NAME.xmark} aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Text preset={TEXT_PRESET.heading1}>{data?.displayName || data?.serviceName}</Text>
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={() => setEditDisplayName(!editDisplayName)}
            >
              <Icon name={ICON_NAME.pen} aria-hidden="true" />
            </Button>
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-5">
          <ChangelogMenu links={CHANGELOG_LINKS} />
          <GuideMenu items={guideItems} />
        </div>
      </div>
      {!isOverridedPage && (
        <>
          <div className="mb-7 flex items-center justify-between">
            <Text>{data?.serviceName}</Text>
          </div>
          <ExpirationDate />
          {onUpdateError && (
            <Message
              className="mb-10 w-full"
              color={MESSAGE_COLOR.warning}
              dismissible
              onRemove={() => {
                setOnUpdateError(false);
              }}
            >
              {t('hosting_dashboard_loading_error')}
            </Message>
          )}
          <Notifications />
          <div className=" mb-6 mt-8">
            <Tabs withArrows defaultValue={tabs[0].name}>
              <TabList>
                {tabs
                  .filter((tab) => tab.to)
                  .map((tab: DashboardTab) => (
                    <a href={tab.to} className="no-underline" key={tab.name}>
                      <Tab
                        key={tab.name}
                        value={tab.title}
                        aria-selected={tab.name === activeTab?.name}
                        className="flex items-center gap-2"
                      >
                        <span>{tab.title}</span>
                        {tab.badge && (
                          <Badge color={BADGE_COLOR[tab.badge.color || 'beta']} size="sm">
                            {tab.badge.label}
                          </Badge>
                        )}
                      </Tab>
                    </a>
                  ))}
              </TabList>
            </Tabs>
          </div>
        </>
      )}
      <Outlet />
    </BaseLayout>
  );
}
