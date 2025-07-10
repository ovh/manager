import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';
import appConfig from '@/identity-access-management.config';
import ResourcesListDatagrid from '@/components/resourcesDatagrid/ResourcesDatagrid.component';
import { ResourcesDatagridContextProvider } from '@/components/resourcesDatagrid/ResourcesDatagridContext';
import AssignTagTopbar from './components/AssignTagTopbar.component';

export default function AssignTag() {
  const { t } = useTranslation('tag-manager');
  const { tags } = (useLocation().state as { tags: string[] }) || { tags: [] };
  const navigate = useNavigate();

  const header = {
    title: t('assignMultipleToResources'),
  };

  return (
    <RedirectionGuard
      condition={tags.length === 0}
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
          <div className="flex gap-5 items-center mt-9">
            <OdsText preset={ODS_TEXT_PRESET.heading5}>
              {t('tagsBeingAssigned')}
            </OdsText>
            <div className="flex gap-3">
              {tags.map((tag) => (
                <OdsBadge
                  key={tag}
                  color={ODS_BADGE_COLOR.neutral}
                  label={tag}
                  size={ODS_BADGE_SIZE.md}
                  data-testid="assigned-resource"
                />
              ))}
            </div>
          </div>
          <div className="flex gap-5 items-center mt-9">
            <OdsText preset={ODS_TEXT_PRESET.heading5}>
              {t('resourcesBeingAssigned')}
            </OdsText>
            <OdsText>{t('resourcesBeingAssignedDescription')}</OdsText>
          </div>
          <div className="mt-9">
            <ResourcesDatagridContextProvider>
              <ResourcesListDatagrid
                topbar={<AssignTagTopbar tags={tags} />}
                isSelectable={true}
              />
            </ResourcesDatagridContextProvider>
          </div>
        </React.Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
