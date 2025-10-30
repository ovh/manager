import { useContext, useEffect, useMemo, useState } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
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

import { ShellContext, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import {
  ActionMenu,
  BaseLayout,
  ChangelogMenu,
  GuideMenu,
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
import { useEmailsUrl, useHostingUrl } from '@/hooks';
import { subRoutes, urls } from '@/routes/routes.constants';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

import { GUIDE_URL } from '../websites/websites.constants';

export default function Layout() {
  const { shell } = useContext(ShellContext);
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');

  const { data } = useGetHostingService(serviceName);

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
  const multisiteUrl = useHostingUrl(serviceName, 'multisite');
  const sslPathname = `#/${serviceName}/ssl`;
  const moduleUrl = useHostingUrl(serviceName, 'module');
  const logsUrl = useHostingUrl(serviceName, 'user-logs');
  const ftpUrl = useHostingUrl(serviceName, 'ftp');
  const databaseUrl = useHostingUrl(serviceName, 'database');
  const taskUrl = `#/${serviceName}/task`;
  const automatedEmailsUrl = useHostingUrl(serviceName, 'automated-emails');
  const cronUrl = useHostingUrl(serviceName, 'cron');
  const seoUrl = useHostingUrl(serviceName, 'localSeo');
  const boostUrl = useHostingUrl(serviceName, 'boost');
  const mailsUrl = useEmailsUrl(flattenData?.[0]?.domain, 'mailing-list');

  const tabs: DashboardTab[] = useMemo(
    () => [
      {
        name: 'general_information',
        title: t('hosting_tab_GENERAL_INFORMATIONS'),
        to: generalUrl,
      },
      {
        name: 'multisite',
        title: t('hosting_tab_MULTISITE'),
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
      {
        name: 'logs',
        title: t('hosting_tab_USER_LOGS'),
        to: logsUrl,
      },
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
      t,
      generalUrl,
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
    const currentPath = hash || pathname;
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
      label: t('web_hosting_header_guide_general_informations'),
    },
  ];

  return (
    <BaseLayout breadcrumb={<Breadcrumb />}>
      <div className="flex items-center justify-between mt-10">
        {editDisplayName ? (
          <div className="w-2/3 mb-4">
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
        <div className="flex flex-wrap gap-5 justify-end">
          <ChangelogMenu links={CHANGELOG_LINKS} />
          <GuideMenu items={guideItems} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-7">
        <Text>{data?.serviceName}</Text>
        <div className="flex flex-wrap justify-end">
          <ActionMenu
            id="add_domain"
            items={[
              {
                id: 1,
                label: t('hosting_action_add_domain'),
                onClick: () =>
                  navigate(urls.orderDomain.replace(subRoutes.serviceName, serviceName)),
              },
            ]}
          />
        </div>
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
      <div className=" mt-8 mb-6">
        <Tabs withArrows>
          <TabList>
            {tabs.map((tab: DashboardTab) => (
              <a href={tab.to} className="no-underline" key={tab.name}>
                <Tab key={tab.name} value={tab.title} aria-selected={tab.name === activeTab?.name}>
                  {tab.title}
                </Tab>
              </a>
            ))}
          </TabList>
        </Tabs>
      </div>
      <Outlet />
    </BaseLayout>
  );
}
