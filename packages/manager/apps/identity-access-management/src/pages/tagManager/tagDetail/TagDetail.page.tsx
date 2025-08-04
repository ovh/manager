import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { urls } from '@/routes/routes.constant';
import appConfig from '@/identity-access-management.config';
import { ResourcesDatagridContextProvider } from '@/components/resourcesDatagrid/ResourcesDatagridContext';
import ResourcesListDatagrid, {
  ResourceDatagridColumn,
} from '@/components/resourcesDatagrid/ResourcesDatagrid.component';
import TagDetailTopbar from './components/TagDetailTopbar.component';
import { tagTofilter } from '@/utils/formatFiltersForApi';

export default function TagDetail() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('tag-manager');

  const header = {
    title: t('tagDetailTitle', {
      tag,
    }),
  };

  return (
    <RedirectionGuard
      condition={!tag}
      route={urls.tagManager}
      isLoading={false}
    >
      <BaseLayout
        breadcrumb={
          <Breadcrumb
            rootLabel={appConfig.rootLabel}
            appName="identity-access-management"
            hideRootLabel={true}
          />
        }
        header={header}
        backLinkLabel={t('backToTagManager')}
        onClickReturn={() => navigate(urls.tagManager)}
        message={<Notifications />}
      >
        <React.Suspense>
          <OdsText preset={ODS_TEXT_PRESET.heading5}>
            {t('resourceTaggedWithTag', {
              tag,
            })}
          </OdsText>
          <div className="mt-9">
            <ResourcesDatagridContextProvider>
              <ResourcesListDatagrid
                topbar={<TagDetailTopbar tag={tag} />}
                isSelectable={true}
                hideColumn={[ResourceDatagridColumn.TAGS]}
                initFilters={[tagTofilter(tag, true)]}
              />
            </ResourcesDatagridContextProvider>
          </div>
        </React.Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
