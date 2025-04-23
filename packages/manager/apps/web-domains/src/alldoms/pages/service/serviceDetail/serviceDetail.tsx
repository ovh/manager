import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import appConfig from '@/web-domains.config';
import ServiceDetailDomains from '@/alldoms/components/ServiceDetail/ServiceDetailDomains';
import ServiceDetailInformation from '@/alldoms/components/ServiceDetail/ServiceDetailInformation';
import ServiceDetailSubscribing from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing';
import { useGetServiceInfo } from '@/alldoms/hooks/data/useGetServiceInfo';
import Loading from '@/alldoms/components/Loading/Loading';

export default function ServiceDetail() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['allDom', 'web-domains/error']);

  const header = {
    title: serviceName,
  };

  const { data: serviceInfoDetail, isLoading } = useGetServiceInfo({
    serviceName,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={t('title')}
          appName={appConfig.rootLabel}
          hideRootLabel
        />
      }
      header={header}
    >
      <React.Suspense>
        <section>
          <div className="grid grid-cols-1 gap-6 items-start mb-8 lg:grid-cols-2">
            <ServiceDetailInformation
              allDomProperty={serviceInfoDetail.allDomProperty}
              extensionsList={
                serviceInfoDetail.domainAttached.currentState.extensions
              }
              status={serviceInfoDetail.serviceInfo.billing.renew.current.mode}
            />
            <ServiceDetailSubscribing serviceInfoDetail={serviceInfoDetail} />
          </div>
          <ServiceDetailDomains
            items={serviceInfoDetail.domainAttached.currentState.domains}
          />
        </section>
        <Outlet />
      </React.Suspense>
    </BaseLayout>
  );
}
