import { BaseLayout } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import appConfig from '@/web-domains.config';
import ServiceDetailDomains from '@/alldoms/components/ServiceDetail/ServiceDetailDomains';
import ServiceDetailInformation from '@/alldoms/components/ServiceDetail/ServiceDetailInformation';
import ServiceDetailSubscribing from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing';
import { useGetServiceInfo } from '@/alldoms/hooks/data/useGetServiceInfo';
import Loading from '@/alldoms/components/Loading/Loading';
import Breadcrumb from '@/alldoms/components/breadcrumb/breadcrumb.component';

export default function ServiceDetail() {
  const { t } = useTranslation(['allDom', 'web-domains/error']);
  const { serviceName } = useParams<{ serviceName: string }>();

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
          appName={`${appConfig.rootLabel}/${appConfig.alldomLabel}`}
          ignoredLabel={[appConfig.alldomLabel]}
        />
      }
      header={header}
    >
      <React.Suspense>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ServiceDetailInformation
              allDomProperty={serviceInfoDetail.allDomProperty}
              domainsAttached={serviceInfoDetail.domainAttached}
              status={serviceInfoDetail.serviceInfo.billing.renew.current.mode}
            />
            <ServiceDetailDomains
              domainsAttached={serviceInfoDetail.domainAttached}
            />
          </div>
          <ServiceDetailSubscribing />
        </section>
      </React.Suspense>
    </BaseLayout>
  );
}
