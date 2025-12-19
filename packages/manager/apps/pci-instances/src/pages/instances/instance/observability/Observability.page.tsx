import { FC, Suspense } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { TProject } from '@ovh-ux/manager-pci-common';
import { MetricsToCustomerModule } from '@ovh-ux/metrics-to-customer';

import { useInstanceParams } from '../../action/hooks/useInstanceActionModal';

import '@ovh-ux/metrics-to-customer/dist/style.css';

const ObservabilityPage: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  const { instanceId } = useInstanceParams();

  const resourceURN = `urn:v1:eu:resource:publicCloudProject:${project.project_id}/instance/${instanceId}`;

  return (
    <Suspense fallback="loading observability module ...">
      <MetricsToCustomerModule
        resourceName={instanceId}
        productType="instances"
        resourceURN={resourceURN}
      />
    </Suspense>
  );
};

export default ObservabilityPage;
