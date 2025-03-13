import React, { useEffect, useMemo, useState } from 'react';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useLocation, useMatches, useSearchParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useDomains, useGenerateUrl, usePlatform, useAccount } from '@/hooks';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constants';
import EmailAccountSettings from './EmailAccountSettings.page';
import EmailAccountsAlias from './EmailAccountsAlias.page';
import Redirections from '../Redirections/Redirections';
import { FEATURE_FLAGS } from '@/utils';
import AutoReplies from '../AutoReplies/AutoReplies';
import {
  ADD_EMAIL_ACCOUNT,
  BACK_PREVIOUS_PAGE,
  EDIT_EMAIL_ACCOUNT,
  EMAIL_ACCOUNT_ALIAS,
  EMAIL_ACCOUNT_AUTO_REPLY,
  EMAIL_ACCOUNT_REDIRECTION,
} from '@/tracking.constant';
import TabsPanel, {
  activatedTabs,
  computePathMatchers,
  TabItemProps,
} from '@/components/layout-helpers/Dashboard/TabsPanel';
import { ResourceStatus } from '@/api/api.type';

export default function AddAndEditAccount() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const location = useLocation();
  const matches = useMatches();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const [isLoading, setIsLoading] = useState(true);
  const goBackUrl = useGenerateUrl(
    matches.find((m) => m.pathname.endsWith('email_accounts'))?.pathname ||
      '..',
    'href',
  );
  const [isSettingsTab, setIsSettingsTab] = useState(false);
  const [isAliasTab, setIsAliasTab] = useState(false);
  const [isRedirectionsTab, setIsRedirectionsTab] = useState(false);
  const [isAutoRepliesTab, setIsAutoRepliesTab] = useState(false);

  const {
    data: editAccountDetail,
    isLoading: isLoadingEmailDetailRequest,
  } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
    gcTime: 0,
  });

  const { data: domainList, isLoading: isLoadingDomainRequest } = useDomains({
    shouldFetchAll: true,
  });

  const domains = useMemo(() => {
    return domainList?.filter(
      (domain) => domain.resourceStatus === ResourceStatus.READY,
    );
  }, [domainList]);

  const pathMatcherSettingsTabs = computePathMatchers(
    [urls.email_accounts_add, urls.email_accounts_edit],
    platformId,
  );

  const pathMatcherAliasTabs = computePathMatchers(
    [
      urls.email_accounts_alias,
      urls.email_accounts_alias_add,
      urls.email_accounts_alias_delete,
    ],
    platformId,
  );

  const pathMatcherRedirectionsTabs = computePathMatchers(
    [
      urls.email_accounts_redirections,
      urls.email_accounts_redirections_add,
      urls.email_accounts_redirections_delete,
    ],
    platformId,
  );

  const pathMatcherAutoRepliesTabs = computePathMatchers(
    [
      urls.email_accounts_auto_replies,
      urls.email_accounts_auto_replies_add,
      urls.email_accounts_auto_replies_delete,
    ],
    platformId,
  );

  useEffect(() => {
    if (!isLoadingEmailDetailRequest && !isLoadingDomainRequest && platformId) {
      setIsSettingsTab(activatedTabs(pathMatcherSettingsTabs, location));
      setIsAliasTab(activatedTabs(pathMatcherAliasTabs, location));
      setIsRedirectionsTab(
        activatedTabs(pathMatcherRedirectionsTabs, location),
      );
      setIsAutoRepliesTab(activatedTabs(pathMatcherAutoRepliesTabs, location));
      setIsLoading(false);
    }
  }, [isLoadingEmailDetailRequest, isLoadingDomainRequest, location.pathname]);

  const params = {
    editEmailAccountId,
  };

  const hrefSettings = useGenerateUrl('../settings', 'path', params);
  const hrefAlias = useGenerateUrl('../alias', 'path', params);
  const hrefRedirections = useGenerateUrl('../redirections', 'path', params);
  const hrefAutoReplies = useGenerateUrl('../auto_replies', 'path', params);

  const tabsList: TabItemProps[] = [
    {
      name: 'settings',
      trackingName: EDIT_EMAIL_ACCOUNT,
      title: t('common:email_account_settings'),
      to: hrefSettings,
      pathMatchers: pathMatcherSettingsTabs,
    },
    {
      name: 'alias',
      trackingName: EMAIL_ACCOUNT_ALIAS,
      title: t('common:alias'),
      to: hrefAlias,
      pathMatchers: pathMatcherAliasTabs,
      hidden: !FEATURE_FLAGS.ALIAS,
    },
    {
      name: 'redirection',
      trackingName: EMAIL_ACCOUNT_REDIRECTION,
      title: t('common:redirection'),
      to: hrefRedirections,
      pathMatchers: pathMatcherRedirectionsTabs,
      hidden: !FEATURE_FLAGS.REDIRECTIONS,
    },
    {
      name: 'auto_reply',
      trackingName: EMAIL_ACCOUNT_AUTO_REPLY,
      title: t('common:auto_reply'),
      to: hrefAutoReplies,
      pathMatchers: pathMatcherAutoRepliesTabs,
      hidden: !FEATURE_FLAGS.AUTOREPLIES,
    },
  ];

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div
            className="flex flex-col items-start space-y-4 mb-6"
            data-testid="page-title"
          >
            <Links
              iconAlignment={IconLinkAlignmentType.left}
              type={LinkType.back}
              href={goBackUrl}
              onClickReturn={() => {
                trackClick({
                  location: PageLocation.funnel,
                  buttonType: ButtonType.link,
                  actionType: 'navigation',
                  actions: [
                    editEmailAccountId ? EDIT_EMAIL_ACCOUNT : ADD_EMAIL_ACCOUNT,
                    BACK_PREVIOUS_PAGE,
                  ],
                });
              }}
              label={t('zimbra_account_add_cta_back')}
            />
            <Subtitle>
              {!editAccountDetail
                ? t('common:add_email_account')
                : t('zimbra_account_edit_title', {
                    account: editAccountDetail?.currentState?.email,
                  })}
            </Subtitle>
          </div>
          {editAccountDetail && (
            <div className="mt-5 mb-8">
              <TabsPanel tabs={tabsList} />
            </div>
          )}
          {isSettingsTab && (
            <EmailAccountSettings
              domains={domains}
              editAccountDetail={editAccountDetail}
            />
          )}
          {isAliasTab && <EmailAccountsAlias />}
          {isRedirectionsTab && <Redirections />}
          {isAutoRepliesTab && <AutoReplies />}
        </>
      )}
    </>
  );
}
