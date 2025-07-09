import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';

import appConfig from '@/identity-access-management.config';
import { labels } from '@/test-utils/labels';

export default function AssignTag() {
  const { t } = useTranslation('tag-manager');

  const header = {
    title: t(labels.tagManager.assignTags),
  };

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={appConfig.rootLabel}
          appName="identity-access-management"
          hideRootLabel={true}
        />
      }
      header={header}
    >
      <React.Suspense></React.Suspense>
    </BaseLayout>
  );
}
