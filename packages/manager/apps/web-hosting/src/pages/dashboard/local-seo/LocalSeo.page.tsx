import React, { useContext } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, Notifications, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/components/loading/Loading.component';
import { LOCAL_SEO_ORDER_OPTIONS_SERVICE, LOCAL_SEO_VISIBILITY_CHECKER } from '@/constants';
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

  const { flattenData, hasNextPage, fetchNextPage, isLoading } = useResourcesIcebergV6({
    route: `/hosting/web/${serviceName}/localSeo/location`,
    queryKey: ['hosting', 'web', serviceName, 'localSeo', 'location'],
  });

  return (
    <React.Suspense fallback={<Loading />}>
      <Notifications />
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-6 mt-4">
        {t('hosting_tab_LOCAL_SEO')}
      </OdsText>
      <OdsText className="mb-6">
        {t('hosting_tab_LOCAL_SEO_description')}
        <OdsLink
          href={LOCAL_SEO_VISIBILITY_CHECKER}
          className="ml-3"
          target="_blank"
          icon={ODS_ICON_NAME.externalLink}
          label={t('hosting_dashboard_local_seo_visibility_check')}
        />
      </OdsText>
      <OdsButton
        className="mb-10"
        size={ODS_BUTTON_SIZE.sm}
        label={t(`${NAMESPACES.ACTIONS}:order`)}
        onClick={(e) => {
          window.open(localSeoOrderURL.replace('{serviceName}', serviceName));
          e.preventDefault();
        }}
      />
      {columns && (
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={flattenData?.length || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}
