import { useEffect, useContext, Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ManagerButton,
  ChangelogButton,
  HeadersProps,
  Notifications,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';

import { CHANGELOG_CHAPTERS, CHANGELOG_LINKS, IAM_FEATURES } from '@/constants';
import { useGetIamUser } from '@/data/hooks/useGetIamUser';
import { useParam } from '@/hooks/useParam';
import { useIamUserTokenList } from '@/data/hooks/useGetIamUserTokens';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from '@/pages/permanentTokens/listing/useDatagridColumn';
import { subRoutes } from '@/routes/routes.constant';

import { PermanentTokensBreadcrumb } from '@/pages/permanentTokens/components/PermanentTokenBreadcrumb.component';

export default function PermanentTokensListing() {
  const { t } = useTranslation('permanent-tokens');
  const navigate = useNavigate();
  const { shell } = useContext(ShellContext);
  const userId = useParam('userId');

  // Check feature-availability for permanent token, and redirect if needed.
  const {
    data: featureAvailability,
    isLoading: isFeatureAvailabilityLoading,
  } = useFeatureAvailability([IAM_FEATURES.PERMANENT_TOKENS]);
  const isPermanentTokenEnabled =
    featureAvailability && featureAvailability[IAM_FEATURES.PERMANENT_TOKENS];
  useEffect(() => {
    if (!isFeatureAvailabilityLoading && !isPermanentTokenEnabled) {
      shell?.navigation.navigateTo('', '/iam/identities/users', {});
    }
  }, [shell, isFeatureAvailabilityLoading, isPermanentTokenEnabled]);

  const header: HeadersProps = {
    title: t('iam_user_tokens_title'),
    description: ((
      <div>
        <span className="mr-8">{t('iam_user_tokens_user_name')}</span>
        <strong>{userId}</strong>
      </div>
    ) as unknown) as string,
    changelogButton: (
      <ChangelogButton links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />
    ),
  };

  const { isLoading: isUserLoading, isError: isUserError } = useGetIamUser(
    userId,
  );

  const columns = useDatagridColumn();
  const {
    flattenData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    sorting,
    setSorting,
    search,
  } = useIamUserTokenList({ userId, columns, pageSize: 10 });

  const handleReturnLink = () => {
    // TODO: tracking
    shell?.navigation.navigateTo('', '/iam/identities/users', {});
  };

  const handleCreateToken = () => {
    // TODO: tracking
    navigate(subRoutes.permanentTokensAdd);
  };

  if (isUserError) {
    throw new Error(`Could not fetch user '${userId}'.`);
  }

  return (
    <BaseLayout
      header={header}
      backLinkLabel={t('iam_user_tokens_return_to_identity_list')}
      onClickReturn={handleReturnLink}
      breadcrumb={<PermanentTokensBreadcrumb />}
      message={<Notifications />}
    >
      {!isUserLoading && (
        <Datagrid
          topbar={
            <ManagerButton
              id="create-user-token"
              label={t('iam_user_tokens_add_new_token')}
              onClick={handleCreateToken}
            />
          }
          isLoading={isLoading}
          columns={columns}
          items={flattenData || []}
          totalItems={10}
          onFetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage && !isLoading}
          sorting={sorting}
          onSortChange={setSorting}
          manualSorting={false}
          search={search}
          contentAlignLeft
          getRowId={(token) => token.name}
        />
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
