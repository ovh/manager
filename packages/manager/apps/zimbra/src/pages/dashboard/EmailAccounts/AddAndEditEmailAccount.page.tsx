import React, { useEffect, useState } from 'react';
import { LinkType, Links, Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  useLocation,
  useNavigate,
  useResolvedPath,
  useSearchParams,
} from 'react-router-dom';
import { useDomains, useGenerateUrl, usePlatform, useAccount } from '@/hooks';
import Loading from '@/components/Loading/Loading';
import { TabItemProps, AccountTabsPanel } from './AccountTabsPanel.component';
import { urls } from '@/routes/routes.constants';
import EmailAccountSettings from './EmailAccountSettings.page';
import EmailAccountsAlias from './EmailAccountsAlias.page';

export default function AddAndEditAccount() {
  const { t } = useTranslation('accounts/addAndEdit');
  const location = useLocation();
  const navigate = useNavigate();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const [isLoading, setIsLoading] = useState(true);
  const goBackUrl = useGenerateUrl('..', 'path');
  const [isSettingsTab, setIsSettingsTab] = useState(false);
  const [isAliasTab, setIsAliasTab] = useState(false);

  const goBack = () => {
    return navigate(goBackUrl);
  };

  const {
    data: editAccountDetail,
    isLoading: isLoadingEmailDetailRequest,
  } = useAccount(editEmailAccountId);

  const { data: domainList, isLoading: isLoadingDomainRequest } = useDomains(
    null,
    true,
  );

  function activatedTabs(pathMatchers: RegExp[]) {
    return pathMatchers?.some((pathMatcher) =>
      pathMatcher.test(location.pathname),
    );
  }
  function computePathMatchers(routes: string[]) {
    return routes.map(
      (path) => new RegExp(path.replace(':serviceName', platformId)),
    );
  }
  const pathMatcherSettingsTabs = computePathMatchers([
    urls.email_accounts_add,
    urls.email_accounts_edit,
  ]);

  const pathMatcherAliasTabs = computePathMatchers([
    urls.email_accounts_alias,
    urls.email_accounts_alias_add,
    urls.email_accounts_alias_delete,
  ]);

  useEffect(() => {
    if (!isLoadingEmailDetailRequest && !isLoadingDomainRequest && platformId) {
      setIsSettingsTab(activatedTabs(pathMatcherSettingsTabs));
      setIsAliasTab(activatedTabs(pathMatcherAliasTabs));
      setIsLoading(false);
    }
  }, [isLoadingEmailDetailRequest, isLoadingDomainRequest, location.pathname]);

  const basePath = useResolvedPath('..').pathname;

  const tabsList: TabItemProps[] = [
    {
      name: 'settings',
      title: t('zimbra_account_edit_tabs_settings'),
      to: `${basePath}/settings?editEmailAccountId=${editEmailAccountId}`,
      pathMatchers: pathMatcherSettingsTabs,
    },
    {
      name: 'alias',
      title: t('zimbra_account_edit_tabs_alias'),
      to: `${basePath}/alias?editEmailAccountId=${editEmailAccountId}`,
      pathMatchers: pathMatcherAliasTabs,
    },
  ];

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div
            className="flex flex-col items-start space-y-4 mb-5"
            data-testid="page-title"
          >
            <Links
              type={LinkType.back}
              onClickReturn={goBack}
              label={t('zimbra_account_add_cta_back')}
            />
            <Subtitle>
              {!editAccountDetail
                ? t('zimbra_account_add_title')
                : t('zimbra_account_edit_title', {
                    account: editAccountDetail?.currentState?.email,
                  })}
            </Subtitle>
          </div>
          {editAccountDetail && (
            <div className="mt-5 mb-8">
              <AccountTabsPanel tabs={tabsList} />
            </div>
          )}
          {isSettingsTab && (
            <EmailAccountSettings
              domainList={domainList}
              editAccountDetail={editAccountDetail}
            />
          )}
          {isAliasTab && <EmailAccountsAlias />}
        </>
      )}
    </>
  );
}
