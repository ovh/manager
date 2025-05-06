import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import appConfig from '@/web-domains.config';

export default function ServiceDetail() {
  const { t } = useTranslation('allDom');
  const { serviceName } = useParams<{ serviceName: string }>();
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
        <div>{serviceName}</div>
      </React.Suspense>
    </BaseLayout>
  );
}
