import { FC, Suspense } from 'react';

import { useEnvironmentRegion } from '@/hooks/region/useEnvironmentRegion';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { MetricsToCustomerModule } from '@ovh-ux/metrics-to-customer';

import '@ovh-ux/metrics-to-customer/dist/index.scss';
import { Spinner } from '@ovhcloud/ods-react';

const ObservabilityPage: FC = () => {

  const envRegion = useEnvironmentRegion();

  const projectId = useProjectId();

  const { instanceId, region } = useInstanceParams();

  const productType = "publicCloudProject/instance";
  const resourceURN = `urn:v1:${envRegion}:resource:publicCloudProject:${projectId}/instance/${instanceId}`;

  const subscribeUrl = `/cloud/project/${projectId}/region/${region}/instance/${instanceId}/metric/subscription`;

  return (
    <Suspense fallback={<Spinner />}>
      <MetricsToCustomerModule
        resourceName={instanceId}
        productType={productType}
        resourceURN={resourceURN}
        enableConfigurationManagement={true}
        subscriptionUrls={{
          subscribeUrl,
        }}
        defaultRetention="30d"
      />
    </Suspense>
  );
};

export default ObservabilityPage;
