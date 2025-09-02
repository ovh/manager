import { useContext, useEffect, useMemo, useState } from 'react';

import { Outlet, useLocation, useNavigate, useParams, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsInput, OdsMessage, OdsTab, OdsText } from '@ovhcloud/ods-components/react';

import {
  ActionMenu,
  ChangelogButton,
  GuideButton,
  GuideItem,
  OvhSubsidiary,
  PageLayout,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { ShellContext, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import ExpirationDate from '@/components/expirationDate/ExpirationDate.component';
import Tabs from '@/components/tabs/Tabs.component';
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
  const { flattenData } = useResourcesIcebergV6<EmailOptionType>({
    route: `/hosting/web/${serviceName}/emailOption`,
    queryKey: ['hosting', 'web', serviceName, 'emailOption'],
  });
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [editDisplayName, setEditDisplayName] = useState<boolean>(false);
  const [onUpdateError, setOnUpdateError] = useState<boolean>(false);

  const { pathname: path } = useLocation();

  const generalUrl = useHostingUrl(serviceName);
  const multisiteUrl = useHostingUrl(serviceName, 'multisite');
  const sslPathname = useResolvedPath('ssl').pathname;
  const moduleUrl = useHostingUrl(serviceName, 'module');
  const logsUrl = useHostingUrl(serviceName, 'user-logs');
  const ftpUrl = useHostingUrl(serviceName, 'ftp');
  const databaseUrl = useHostingUrl(serviceName, 'database');
  const taskUrl = useHostingUrl(serviceName, 'task');
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

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.to === path);
  }, [tabs, path]);

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
                onClick: () =>
                  navigate(urls.orderDomain.replace(subRoutes.serviceName, serviceName)),
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
