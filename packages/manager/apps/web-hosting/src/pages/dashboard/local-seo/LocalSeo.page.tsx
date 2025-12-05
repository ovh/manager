import React, { useContext } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_SIZE, Button, ICON_NAME, Icon, Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Datagrid, Notifications, useDataApi } from '@ovh-ux/muk';

import Loading from '@/components/loading/Loading.component';
import { LOCAL_SEO_ORDER_OPTIONS_SERVICE, LOCAL_SEO_VISIBILITY_CHECKER } from '@/constants';
import { LocalSeoType } from '@/data/types/product/seo';
import useDatagridColumn from '@/hooks/localSeo/useDatagridColumn';

export default function LocalSeo() {
  const { serviceName } = useParams();
  const { t } = useTranslation(['local-seo', NAMESPACES.ACTIONS]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const localSeoOrderURL =
    LOCAL_SEO_ORDER_OPTIONS_SERVICE[
      ovhSubsidiary as keyof typeof LOCAL_SEO_ORDER_OPTIONS_SERVICE
    ] ?? LOCAL_SEO_ORDER_OPTIONS_SERVICE.FR;

  const columns = useDatagridColumn();

  const { flattenData, hasNextPage, fetchNextPage, isLoading } = useDataApi<LocalSeoType>({
    version: 'v6',
    route: `/hosting/web/${serviceName}/localSeo/location`,
    cacheKey: ['hosting', 'web', serviceName, 'localSeo', 'location'],
    enabled: !!serviceName,
    iceberg: true,
  });

  return (
    <React.Suspense fallback={<Loading />}>
      <Notifications />
      <Text preset={TEXT_PRESET.heading3} className="mb-6 mt-4">
        {t('hosting_tab_LOCAL_SEO')}
      </Text>
      <Text className="mb-6">
        {t('hosting_tab_LOCAL_SEO_description')}
        <Link href={LOCAL_SEO_VISIBILITY_CHECKER} className="ml-3" target="_blank">
          <>
            {t('hosting_dashboard_local_seo_visibility_check')}
            <Icon name={ICON_NAME.externalLink}></Icon>
          </>
        </Link>
      </Text>
      <Button
        className="mb-10"
        size={BUTTON_SIZE.sm}
        onClick={(event) => {
          window.open(localSeoOrderURL.replace('{serviceName}', serviceName));
          event.preventDefault();
        }}
      >
        {t(`${NAMESPACES.ACTIONS}:order`)}
      </Button>

      <Datagrid
        columns={flattenData ? columns : []}
        data={flattenData || []}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        isLoading={isLoading}
      />
    </React.Suspense>
  );
}
