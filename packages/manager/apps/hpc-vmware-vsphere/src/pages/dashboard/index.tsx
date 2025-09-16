import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useResolvedPath,
  useParams,
  useNavigate,
} from 'react-router-dom';
import {
  OdsTabs,
  OdsTab,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  HeadersProps,
  GuideButton,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';

import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import appConfig from '@/hpc-vmware-vsphere.config';

import { VSPHERE_CHANGELOGS_LINKS } from './dashboard.constants';
import { HybridBreadcrumbItem } from '@/hooks/breadcrumb/HybridBreadcrumbItem';
import { DashboardTabItem } from '@/types/DashboardTabItem';

import { useActivePanel } from '@/hooks/useActivePanel';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { useHybridBreadcrumb } from '@/hooks/breadcrumb/useHybridBreadcrumb';
import { useVmwareVsphere } from '@/data/hooks/useVmwareVsphere';

export type DashboardLayoutProps = {
  tabs: DashboardTabItem[];
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const { data: vmwareVsphere, isLoading: isLoadingVsphere } = useVmwareVsphere(
    serviceName,
  );

  const service = {
    name: serviceName,
    description: vmwareVsphere?.data?.description ?? serviceName,
  };

  const guides = useGuideUtils();

  const { t } = useTranslation('dashboard');

  const { legacyApplication, legacyPath, dedicatedCloudTitle } = appConfig;

  const { data: legacyAppBaseUrl } = useNavigationGetUrl([
    legacyApplication,
    `/${legacyPath}`,
    {},
  ]) as { data: string };

  const legacyAppServiceBaseUrl = `${legacyAppBaseUrl}/${service.name}`;

  const tabsList: DashboardTabItem[] = [
    {
      name: 'general_informations',
      title: t('tabs_label_general_informations'),
      to: legacyAppServiceBaseUrl,
      isRedirectLegacy: true,
    },
    {
      name: 'datacenters',
      title: t('tabs_label_datacenters'),
      to: `${legacyAppServiceBaseUrl}/datacenter`,
      isRedirectLegacy: true,
    },
    {
      name: 'users',
      title: t('tabs_label_users'),
      to: `${legacyAppServiceBaseUrl}/users`,
      isRedirectLegacy: true,
    },
    {
      name: 'security',
      title: t('tabs_label_security'),
      to: `${legacyAppServiceBaseUrl}/security`,
      isRedirectLegacy: true,
    },
    {
      name: 'operations',
      title: t('tabs_label_operations'),
      to: `${legacyAppServiceBaseUrl}/operation`,
      isRedirectLegacy: true,
    },
    {
      name: 'license',
      title: t('tabs_label_license'),
      to: `${legacyAppServiceBaseUrl}/license`,
      isRedirectLegacy: true,
    },
    {
      name: 'logs',
      title: t('tabs_label_logs'),
      to: useResolvedPath('logs').pathname,
      isRedirectLegacy: false,
    },
  ];

  const activePanel = useActivePanel(tabsList);

  const header: HeadersProps = {
    title: service.description,
    changelogButton: <ChangelogButton links={VSPHERE_CHANGELOGS_LINKS} />,
    headerButton: (
      <GuideButton
        items={[
          {
            id: 1,
            label: t('guides_label_discover'),
            href: guides.discover,
            target: '_blank',
          },
          {
            id: 2,
            label: t('guides_label_vsphere_access'),
            href: guides.vsphere_access,
            target: '_blank',
          },
          {
            id: 3,
            label: t('guides_label_veeam_backup'),
            href: guides.veeam_backup,
            target: '_blank',
          },
        ]}
      />
    ),
  };

  const breadcrumbItems: HybridBreadcrumbItem[] = useHybridBreadcrumb({
    appName: dedicatedCloudTitle,
    service,
    legacyAppBaseUrl,
    activePanel,
  });

  if (isLoadingVsphere) {
    return (
      <div className="flex pt-10">
        <OdsSpinner />
      </div>
    );
  }

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb data-testid="breadcrumb">
          {breadcrumbItems?.map((item) => (
            <OdsBreadcrumbItem
              key={item.label}
              href={item.href}
              onOdsClick={() => navigate(item.to)}
              label={item.label}
            />
          ))}
        </OdsBreadcrumb>
      }
      header={header}
      tabs={
        <OdsTabs>
          {tabsList.map((tab: DashboardTabItem) => {
            const { isRedirectLegacy, name, title, to } = tab;
            const isSelected = activePanel?.name === name;
            return isRedirectLegacy ? (
              <a className="no-underline" href={to}>
                <OdsTab
                  key={`osds-tab-bar-item-${name}`}
                  isSelected={isSelected}
                >
                  {title}
                </OdsTab>
              </a>
            ) : (
              <NavLink to={to} className="no-underline">
                <OdsTab
                  key={`osds-tab-bar-item-${name}`}
                  isSelected={isSelected}
                >
                  {title}
                </OdsTab>
              </NavLink>
            );
          })}
        </OdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
