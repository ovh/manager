import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Datagrid, Notifications } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useGetHostingLocalSeo } from '@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo';
import useDatagridColumn from '@/hooks/localSeo/useDatagridColumn';
import Loading from '@/components/loading/Loading.component';
import {
  LOCAL_SEO_ORDER_OPTIONS_SERVICE,
  LOCAL_SEO_VISIBILITY_CHECKER,
} from '@/constants';

export default function LocalSeo() {
  const { serviceName } = useParams();
  const { t } = useTranslation(['local-seo', NAMESPACES.ACTIONS]);

  const columns = useDatagridColumn();
  const { data, isLoading, fetchNextPage, hasNextPage } = useGetHostingLocalSeo(
    serviceName,
  );

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
          window.open(
            LOCAL_SEO_ORDER_OPTIONS_SERVICE.replace(
              '{serviceName}',
              serviceName,
            ),
          );
          e.preventDefault();
        }}
      />
      {columns && (
        <Datagrid
          columns={columns}
          items={data || []}
          totalItems={data?.length || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}
