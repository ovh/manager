import React, { useContext } from 'react';
import {
  Outlet,
  useResolvedPath,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';

import {
  BaseLayout,
  GuideButton,
  GuideItem,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsTag } from '@ovhcloud/ods-components/react';
import { ODS_TAG_COLOR, ODS_TAG_SIZE } from '@ovhcloud/ods-components';
import TabsPanel, { TabItemProps } from './TabsPanel';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { GUIDES_LIST } from '@/guides.constants';
import { urls } from '@/routes/routes.constants';

import './Dashboard.scss';
import { FEATURE_FLAGS } from '@/utils';
import { useOrganization } from '@/hooks';

export const Dashboard: React.FC = () => {
  const { platformId } = useParams();
  const { notifications } = useNotifications();
  const { data: organization } = useOrganization();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const location = useLocation();
  const basePath = useResolvedPath('').pathname;

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: `${GUIDES_LIST.administrator_guide.url[ovhSubsidiary] ||
        GUIDES_LIST.administrator_guide.url.DEFAULT}`,
      target: '_blank',
      label: t('zimbra_dashboard_administrator_guide'),
    },
  ];

  const params = new URLSearchParams(location.search);
  const selectedOrganizationId = params.get('organizationId');
  function computePathMatchers(routes: string[]) {
    return routes.map(
      (path) => new RegExp(path.replace(':serviceName', platformId)),
    );
  }
  const tabsList: TabItemProps[] = [
    {
      name: 'general_informations',
      title: t('zimbra_dashboard_general_informations'),
      to: basePath,
      pathMatchers: computePathMatchers([urls.dashboard]),
    },
    {
      name: 'organizations',
      title: t('zimbra_dashboard_organizations'),
      to: `${basePath}/organizations`,
      pathMatchers: computePathMatchers([
        urls.organizations,
        urls.organizationsDelete,
      ]),
      hidden: selectedOrganizationId !== null,
    },
    {
      name: 'domains',
      title: t('zimbra_dashboard_domains'),
      to: `${basePath}/domains`,
      pathMatchers: computePathMatchers([
        urls.domains,
        urls.domainsEdit,
        urls.domainsDelete,
        urls.domains_diagnostic,
      ]),
    },
    {
      name: 'email_accounts',
      title: t('zimbra_dashboard_email_accounts'),
      to: `${basePath}/email_accounts`,
      pathMatchers: computePathMatchers([urls.email_accounts]),
    },
    {
      name: 'mailing_lists',
      title: t('zimbra_dashboard_mailing_lists'),
      to: `${basePath}/mailing_lists`,
      pathMatchers: computePathMatchers([
        urls.mailing_lists,
        urls.mailing_lists_delete,
      ]),
      hidden: !FEATURE_FLAGS.MAILINGLISTS,
    },
    {
      name: 'redirections',
      title: t('zimbra_dashboard_redirections'),
      to: `${basePath}/redirections`,
      pathMatchers: computePathMatchers([
        urls.redirections,
        urls.redirections_delete,
        urls.redirections_edit,
      ]),
      hidden: !FEATURE_FLAGS.REDIRECTIONS,
    },
    {
      name: 'auto_replies',
      title: t('zimbra_dashboard_auto_replies'),
      to: `${basePath}/auto_replies`,
      pathMatchers: computePathMatchers([urls.auto_replies]),
      hidden: !FEATURE_FLAGS.AUTOREPLIES,
    },
  ];

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: 'Zimbra',
        headerButton: <GuideButton items={guideItems} />,
      }}
      subtitle={
        organization &&
        (((
          <>
            <span>{organization.currentState.name}</span>
            <OdsTag
              color={ODS_TAG_COLOR.information}
              onClick={() => navigate(location.pathname)}
              className="ml-6 font-normal org-tag"
              size={ODS_TAG_SIZE.lg}
              label={organization.currentState.label}
            />
          </>
        ) as unknown) as string) // subtitle should accept a ReactElement
      }
      message={
        // temporary fix margin even if empty
        notifications.length ? <Notifications /> : null
      }
      tabs={<TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
};

export default Dashboard;
