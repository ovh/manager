import React, { useEffect } from 'react';

import { Outlet, useMatches, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { IconLinkAlignmentType, LinkType, Links, Subtitle } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { Loading, TabItemProps, TabsPanel, useComputePathMatchers } from '@/components';
import { useAccount } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { urls } from '@/routes/routes.constants';
import {
  BACK_PREVIOUS_PAGE,
  EDIT_EMAIL_ACCOUNT,
  EMAIL_ACCOUNT_ALIAS,
  EMAIL_ACCOUNT_AUTO_REPLY,
  EMAIL_ACCOUNT_REDIRECTION,
} from '@/tracking.constants';
import { FEATURE_FLAGS } from '@/utils';

export const EmailAccountSettingsLayout = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const matches = useMatches();
  const navigate = useNavigate();
  const { accountId } = useParams();
  const goBackUrl = useGenerateUrl(
    matches.find((m) => m.pathname.endsWith('email_accounts'))?.pathname || '..',
    'href',
  );

  const { data: account, isLoading } = useAccount({
    accountId,
    enabled: !!accountId,
    gcTime: 0,
  });

  const pathMatcherSettingsTabs = useComputePathMatchers([
    urls.email_accounts_add,
    urls.email_accounts_edit,
  ]);

  const pathMatcherAliasTabs = useComputePathMatchers([
    urls.email_accounts_alias,
    urls.email_accounts_alias_add,
    urls.email_accounts_alias_delete,
  ]);

  const pathMatcherRedirectionsTabs = useComputePathMatchers([
    urls.email_accounts_redirections,
    urls.email_accounts_redirections_add,
    urls.email_accounts_redirections_delete,
  ]);

  const pathMatcherAutoRepliesTabs = useComputePathMatchers([
    urls.email_accounts_auto_replies,
    urls.email_accounts_auto_replies_add,
    urls.email_accounts_auto_replies_delete,
  ]);

  const hrefSettings = useGenerateUrl('./settings', 'path');
  const hrefAlias = useGenerateUrl('./aliases', 'path');
  const hrefRedirections = useGenerateUrl('./redirections', 'path');
  const hrefAutoReplies = useGenerateUrl('./auto_replies', 'path');

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

  useEffect(() => {
    if (matches?.[matches.length - 1]?.id === 'email_accounts_layout') {
      navigate(hrefSettings);
    }
  }, [matches]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div className="flex flex-col items-start space-y-4 mb-6" data-testid="page-title">
            <Links
              iconAlignment={IconLinkAlignmentType.left}
              type={LinkType.back}
              href={goBackUrl}
              onClickReturn={() => {
                trackClick({
                  location: PageLocation.funnel,
                  buttonType: ButtonType.link,
                  actionType: 'navigation',
                  actions: [EDIT_EMAIL_ACCOUNT, BACK_PREVIOUS_PAGE],
                });
              }}
              label={t('zimbra_account_add_cta_back')}
            />
            <Subtitle>
              {t('zimbra_account_edit_title', {
                account: account?.currentState?.email,
              })}
            </Subtitle>
          </div>
          <div className="mt-5 mb-8">
            <TabsPanel tabs={tabsList} />
          </div>
          <Outlet />
        </>
      )}
    </>
  );
};

export default EmailAccountSettingsLayout;
