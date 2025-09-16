import React, { Suspense, useContext, useMemo } from 'react';

import { Outlet, useResolvedPath, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TAG_COLOR, ODS_TAG_SIZE } from '@ovhcloud/ods-components';
import { OdsTag } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  ChangelogButton,
  GuideButton,
  GuideItem,
  Notifications,
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  Breadcrumb,
  Loading,
  ProBetaBanner,
  TabItemProps,
  TabsPanel,
  useComputePathMatchers,
} from '@/components';
import { FEATURE_AVAILABILITY, MAX_PRO_ACCOUNTS } from '@/constants';
import { useOrganization } from '@/data/hooks';
import { CHANGELOG_LINKS, GUIDES_LIST } from '@/guides.constants';
import { useAccountsStatistics, useGenerateUrl, useOverridePage } from '@/hooks';
import { urls } from '@/routes/routes.constants';
import {
  AUTO_REPLY,
  DOMAIN,
  EMAIL_ACCOUNT,
  GENERAL_INFORMATIONS,
  GO_TO,
  MAILING_LIST,
  ORGANIZATION,
  REDIRECTION,
  UNSELECT_ORGANIZATION,
} from '@/tracking.constants';
import { FEATURE_FLAGS } from '@/utils';

export const DashboardLayout: React.FC = () => {
  const { trackClick } = useOvhTracking();
  const { notifications } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrganizationId = searchParams.get('organizationId');
  const { data: organization } = useOrganization({
    enabled: !!selectedOrganizationId,
  });
  const isOverridePage = useOverridePage();
  const { t } = useTranslation(['dashboard', 'common']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const basePath = useResolvedPath('').pathname;
  const { proCount } = useAccountsStatistics();

  const { data: availability } = useFeatureAvailability([FEATURE_AVAILABILITY.PRO_BETA]);

  const showProBetaBanner = useMemo(
    () => proCount < MAX_PRO_ACCOUNTS && availability?.[FEATURE_AVAILABILITY.PRO_BETA],
    [availability, proCount],
  );

  const TopButtonGuidesListEnum = {
    ADMINISTRATOR_GUIDE: 'administrator_guide',
    USER_GUIDE: 'user_guide',
    MAIL_CONFIGURE_GUIDE: 'mail_configure_guide',
    MAIL_MIGRATE_GUIDE: 'mail_migrate_guide',
  } as const;

  const guideItems: GuideItem[] = Object.values(TopButtonGuidesListEnum).map(
    (
      value: (typeof TopButtonGuidesListEnum)[keyof typeof TopButtonGuidesListEnum],
      key: number,
    ) => ({
      id: key,
      href: GUIDES_LIST[value].url[ovhSubsidiary] || GUIDES_LIST[value].url.DEFAULT,
      target: '_blank',
      label: t(GUIDES_LIST[value].key),
      onClick: () => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.externalLink,
          actionType: 'navigation',
          actions: [GO_TO(GUIDES_LIST[value].tracking)],
        });
      },
    }),
  );

  const tabsList: TabItemProps[] = [
    {
      name: 'general_informations',
      trackingName: GENERAL_INFORMATIONS,
      title: t(`${NAMESPACES.DASHBOARD}:general_information`),
      to: useGenerateUrl(basePath, 'path'),
      pathMatchers: useComputePathMatchers([urls.dashboard]),
    },
    {
      name: 'organization',
      trackingName: ORGANIZATION,
      title: t('common:organization'),
      to: useGenerateUrl(`${basePath}/organizations`, 'path'),
      pathMatchers: useComputePathMatchers([urls.organizations, urls.organizationsDelete]),
      hidden: selectedOrganizationId !== null,
    },
    {
      name: 'domain',
      trackingName: DOMAIN,
      title: t('common:domain'),
      to: useGenerateUrl(`${basePath}/domains`, 'path'),
      pathMatchers: useComputePathMatchers([
        urls.domains,
        urls.domainsEdit,
        urls.domainsDelete,
        urls.domains_diagnostic_mx,
        urls.domains_diagnostic_spf,
        urls.domains_diagnostic_srv,
        urls.domains_diagnostic_dkim,
      ]),
    },
    {
      name: 'email_account',
      trackingName: EMAIL_ACCOUNT,
      title: t('common:email_account'),
      to: useGenerateUrl(`${basePath}/email_accounts`, 'path'),
      pathMatchers: useComputePathMatchers([urls.email_accounts]),
    },
    {
      name: 'mailing_list',
      trackingName: MAILING_LIST,
      title: t('common:mailing_list'),
      to: useGenerateUrl(`${basePath}/mailing_lists`, 'path'),
      pathMatchers: useComputePathMatchers([urls.mailing_lists, urls.mailing_lists_delete]),
      hidden: !FEATURE_FLAGS.MAILINGLISTS,
    },
    {
      name: 'redirection',
      trackingName: REDIRECTION,
      title: t('common:redirection'),
      to: useGenerateUrl(`${basePath}/redirections`, 'path'),
      pathMatchers: useComputePathMatchers([
        urls.redirections,
        urls.redirections_delete,
        urls.redirections_edit,
      ]),
      hidden: !FEATURE_FLAGS.REDIRECTIONS,
    },
    {
      name: 'auto_reply',
      trackingName: AUTO_REPLY,
      title: t('common:auto_reply'),
      to: useGenerateUrl(`${basePath}/auto_replies`, 'path'),
      pathMatchers: useComputePathMatchers([urls.auto_replies]),
      hidden: !FEATURE_FLAGS.AUTOREPLIES,
    },
  ];

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb namespace={['common', NAMESPACES.DASHBOARD]} />}
      header={{
        title: 'Zimbra',
        headerButton: <GuideButton items={guideItems} />,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }}
      subtitle={
        selectedOrganizationId &&
        organization &&
        ((
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
                setSearchParams((prev) => {
                  prev.delete('organizationId');
                  return prev;
                });
              }}
              className="ml-6 font-normal org-tag"
              size={ODS_TAG_SIZE.lg}
              label={organization.currentState.label}
            />
          </>
        ) as unknown as string) // subtitle should accept a ReactElement
      }
      message={
        // temporary fix margin even if empty
        notifications.length || showProBetaBanner ? (
          <div className="flex flex-col gap-4">
            {!!showProBetaBanner && <ProBetaBanner />}
            {!!notifications.length && <Notifications />}
          </div>
        ) : null
      }
      tabs={isOverridePage ? null : <TabsPanel tabs={tabsList} />}
    >
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
};

export default DashboardLayout;
