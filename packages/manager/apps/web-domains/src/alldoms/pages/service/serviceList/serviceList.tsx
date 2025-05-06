import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

import appConfig from '@/web-domains.config';

export default function ServiceList() {
  const { t } = useTranslation('listing');

  const header = {
    title: t('title'),
  };

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={appConfig.rootLabel} appName="web-domains" />
      }
      header={header}
    >
      <React.Suspense>
        <div data-testid="datagrid">
          <Datagrid columns={[]} items={[]} totalItems={0} />
        </div>
      </React.Suspense>
    </BaseLayout>
  );
}
