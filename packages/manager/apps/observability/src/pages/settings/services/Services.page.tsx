import { Outlet } from 'react-router-dom';

import TagsTile from '@/components/dashboard/TagsTile.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import ServiceLinks from '@/pages/settings/services/links/ServiceLinks.component';

import ServiceGeneralInformation from './general-information/ServiceGeneralInformation.component';

export default function ServicesPage() {
  const { selectedService, isLoading } = useObservabilityServiceContext();

  if (!selectedService) {
    return null;
  }

  const title = selectedService?.currentState?.displayName ?? selectedService?.id ?? '';
  const tags = selectedService?.iam?.tags ?? {};

  return (
    <section className="block w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start lg:gap-6">
        <ServiceGeneralInformation
          title={title}
          iam={selectedService?.iam}
          resourceName={selectedService?.id}
          resourceStatus={selectedService?.resourceStatus}
          createdAt={selectedService?.createdAt}
          isLoading={isLoading}
        />
        <TagsTile href="#" title={title} tags={tags} isLoading={isLoading} hideLink={true} />
        <ServiceLinks />
      </div>
      <Outlet />
    </section>
  );
}
