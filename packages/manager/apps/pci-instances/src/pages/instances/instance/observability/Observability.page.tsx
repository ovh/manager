import { FC, Suspense } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { TProject } from '@ovh-ux/manager-pci-common';
import { MetricsToCustomerModule } from '@ovh-ux/metrics-to-customer';

import { useInstanceParams } from '../../action/hooks/useInstanceActionModal';

import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';

const ObservabilityPage: FC = () => {
  const project = useRouteLoaderData('root') as TProject;
  
  const { instanceId, region } = useInstanceParams();

  const { translateMicroRegion } = useTranslatedMicroRegions();

  const resourceURN = `urn:v1:eu:resource:publicCloudProject:${project.project_id}/instance/${instanceId}`;

  const translatedRegion = translateMicroRegion(region);

  return (
    <Suspense fallback="loading observability module ...">
      <MetricsToCustomerModule
        resourceName={instanceId}
        productType="instances"
        resourceURN={resourceURN}
        regions={[{
          code: 'eu-west-gra',
          label: translatedRegion
        }]}
        defaultRetention='30d'
        subscriptionUrls={{
          subscribeUrl: 'pci/instance/metrics/subscribeUrl',
        }}
        enableConfigurationManagement={true}
      />
    </Suspense>
  );
};

export default ObservabilityPage;
