import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';

import { useNavigate, useParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';
import appConfig, { SubApp } from '@/identity-access-management.config';
import ResourcesListDatagrid from '@/components/resourcesDatagrid/ResourcesDatagrid.component';
import { ResourcesDatagridContextProvider } from '@/components/resourcesDatagrid/ResourcesDatagridContext';
import AssignTagTopbar from '../assignTag/components/AssignTagTopbar.component';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';

export default function TagDetailAssign() {
  const { t } = useTranslation('tag-manager');
  const { tag } = useParams();
  const navigate = useNavigate();

  const header = {
    title: t('assignTagToResources', { tag }),
  };

  const onSuccessUrl = urls.tagDetail.replace(':tag', tag);

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
            subApp={SubApp.TAG_MANAGER}
          />
        }
        header={header}
        backLinkLabel={t('backToTagDetail')}
        onClickReturn={() => navigate(urls.tagDetail.replace(':tag', tag))}
        message={<Notifications />}
      >
        <React.Suspense>
          <div className="flex gap-5 items-center mt-9">
            <OdsText preset={ODS_TEXT_PRESET.heading5}>
              {t('resourcesBeingAssigned')}
            </OdsText>
            <OdsText>{t('resourcesBeingAssignedDescription')}</OdsText>
          </div>
          <div className="mt-9">
            <ResourcesDatagridContextProvider>
              <ResourcesListDatagrid
                topbar={
                  <AssignTagTopbar tags={[tag]} onSuccessUrl={onSuccessUrl} />
                }
                isSelectable={true}
              />
            </ResourcesDatagridContextProvider>
          </div>
        </React.Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
