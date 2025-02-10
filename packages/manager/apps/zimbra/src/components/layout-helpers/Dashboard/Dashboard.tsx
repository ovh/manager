import React, { useContext, useMemo } from 'react';
import {
  Outlet,
  useResolvedPath,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  BaseLayout,
  GuideButton,
  GuideItem,
  Notifications,
  useNotifications,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsTag } from '@ovhcloud/ods-components/react';
import { ODS_TAG_COLOR, ODS_TAG_SIZE } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import TabsPanel, { computePathMatchers, TabItemProps } from './TabsPanel';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { GUIDES_LIST, CHANGELOG_LINKS } from '@/guides.constants';
import { urls } from '@/routes/routes.constants';
import { FEATURE_FLAGS } from '@/utils';
import { useGenerateUrl, useOrganization, useOverridePage } from '@/hooks';
import {
  AUTO_REPLY,
  EMAIL_ACCOUNT,
  DOMAIN,
  GENERAL_INFORMATIONS,
  MAILING_LIST,
  ORGANIZATION,
  REDIRECTION,
  GO_TO,
  UNSELECT_ORGANIZATION,
} from '@/tracking.constant';
import './Dashboard.scss';

const whiteListedSearchParams = ['organizationId'];

export const Dashboard: React.FC = () => {
  const { trackClick } = useOvhTracking();
  const { platformId } = useParams();
  const { notifications } = useNotifications();
  const { data: organization } = useOrganization();
  const isOverridePage = useOverridePage();
  const { t } = useTranslation(['dashboard', 'common']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const basePath = useResolvedPath('').pathname;

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: (GUIDES_LIST.administrator_guide.url[ovhSubsidiary] ||
        GUIDES_LIST.administrator_guide.url.DEFAULT) as string,
      target: '_blank',
      label: t('zimbra_dashboard_administrator_guide'),
      onClick: () => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.externalLink,
          actionType: 'navigation',
          actions: [GO_TO(GUIDES_LIST.administrator_guide.tracking)],
        });
      },
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrganizationId = searchParams.get('organizationId');

  const params = useMemo(() => {
    return Object.fromEntries(
      Array.from(searchParams.entries()).filter(([key]) =>
        whiteListedSearchParams.includes(key),
      ),
    );
  }, [searchParams]);

  const tabsList: TabItemProps[] = [
    {
      name: 'general_informations',
      trackingName: GENERAL_INFORMATIONS,
      title: t('common:general_informations'),
      to: useGenerateUrl(basePath, 'path', params),
      pathMatchers: computePathMatchers([urls.dashboard], platformId),
    },
    {
      name: 'organization',
      trackingName: ORGANIZATION,
      title: t('common:organization'),
      to: useGenerateUrl(`${basePath}/organizations`, 'path', params),
      pathMatchers: computePathMatchers(
        [urls.organizations, urls.organizationsDelete],
        platformId,
      ),
      hidden: selectedOrganizationId !== null,
    },
    {
      name: 'domain',
      trackingName: DOMAIN,
      title: t('common:domain'),
      to: useGenerateUrl(`${basePath}/domains`, 'path', params),
      pathMatchers: computePathMatchers(
        [
          urls.domains,
          urls.domainsEdit,
          urls.domainsDelete,
          urls.domains_diagnostic_mx,
          urls.domains_diagnostic_spf,
          urls.domains_diagnostic_srv,
          urls.domains_diagnostic_dkim,
        ],
        platformId,
      ),
    },
    {
      name: 'email_account',
      trackingName: EMAIL_ACCOUNT,
      title: t('common:email_account'),
      to: useGenerateUrl(`${basePath}/email_accounts`, 'path', params),
      pathMatchers: computePathMatchers([urls.email_accounts], platformId),
    },
    {
      name: 'mailing_list',
      trackingName: MAILING_LIST,
      title: t('common:mailing_list'),
      to: useGenerateUrl(`${basePath}/mailing_lists`, 'path', params),
      pathMatchers: computePathMatchers(
        [urls.mailing_lists, urls.mailing_lists_delete],
        platformId,
      ),
      hidden: !FEATURE_FLAGS.MAILINGLISTS,
    },
    {
      name: 'redirection',
      trackingName: REDIRECTION,
      title: t('common:redirection'),
      to: useGenerateUrl(`${basePath}/redirections`, 'path', params),
      pathMatchers: computePathMatchers(
        [urls.redirections, urls.redirections_delete, urls.redirections_edit],
        platformId,
      ),
      hidden: !FEATURE_FLAGS.REDIRECTIONS,
    },
    {
      name: 'auto_reply',
      trackingName: AUTO_REPLY,
      title: t('common:auto_reply'),
      to: useGenerateUrl(`${basePath}/auto_replies`, 'path', params),
      pathMatchers: computePathMatchers([urls.auto_replies], platformId),
      hidden: !FEATURE_FLAGS.AUTOREPLIES,
    },
  ];

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: 'Zimbra',
        headerButton: <GuideButton items={guideItems} />,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }}
      subtitle={
        organization &&
        (((
          <>
            <span>{organization.currentState.name}</span>
            <OdsTag
              color={ODS_TAG_COLOR.information}
              onClick={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.button,
                  actionType: 'navigation',
                  actions: [UNSELECT_ORGANIZATION],
                });
                if (searchParams.has('organizationId')) {
                  searchParams.delete('organizationId');
                  setSearchParams(searchParams);
                }
              }}
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
      tabs={isOverridePage ? null : <TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
};

export default Dashboard;
