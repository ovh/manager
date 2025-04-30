import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import appConfig from '@/web-domains.config';
import ServiceDetailInformation from '@/alldoms/components/ServiceDetail/ServiceDetailInformation';
import ServiceDetailSubscribing from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing';
import { useGetServiceInfo } from '@/alldoms/hooks/data/useGetServiceInfo';
import Loading from '@/alldoms/components/Loading/Loading';
import Modal from '@/alldoms/components/Modal/Modal';
import ServiceDetailDomains from '@/alldoms/components/ServiceDetail/ServiceDetailDomains';
import { useGetDomainDetailInfo } from '@/alldoms/hooks/data/query';

export default function ServiceDetail() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const header = {
    title: serviceName,
  };

  const { data: serviceInfoDetail, isLoading } = useGetServiceInfo({
    serviceName,
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={appConfig.rootLabel} appName="web-domains" />
      }
      header={header}
    >
      {isModalOpen && (
        <Modal
          serviceDetail={serviceInfoDetail}
          closeModal={closeModal}
          modalOpen={isModalOpen}
        />
      )}
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
            <ServiceDetailSubscribing
              serviceInfoDetail={serviceInfoDetail}
              openModal={openModal}
            />
          </div>

          <ServiceDetailDomains
            items={serviceInfoDetail.domainAttached.currentState.domains}
          />
        </section>
      </React.Suspense>
    </BaseLayout>
  );
}
