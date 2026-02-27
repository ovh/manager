import { FC, Suspense } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TProject, useParam } from '@ovh-ux/manager-pci-common';
import { MetricsToCustomerModule } from '@ovh-ux/metrics-to-customer';

import '@ovh-ux/metrics-to-customer/dist/index.scss';
import { ICON_NAME, Message, MESSAGE_COLOR, MessageBody, MessageIcon, Spinner } from '@ovhcloud/ods-react';
import { useIsObservabilityAvailable } from '@/data/api/feature';

const ObservabilityPage: FC = () => {

  const { t } = useTranslation(['observability']);

  const { project_id } = useRouteLoaderData('root') as TProject;

  const { instanceId } = useParam('instanceId');

  const isObservabilityAvailable = useIsObservabilityAvailable();

  if (!isObservabilityAvailable) {
    return <Message
      color={MESSAGE_COLOR.warning}
      className="mt-6"
      dismissible={false}
    >
      <MessageIcon name={ICON_NAME.triangleExclamation} />
      <MessageBody>
        {t(
          'observability:pci_instances_observability_not_available',
        )}
      </MessageBody>
    </Message>;
  }

  const productType = "publicCloudProject/instance";
  const resourceURN = `urn:v1:eu:resource:publicCloudProject:${project_id}/instance/${instanceId}`;

  return (
    <Suspense fallback={<Spinner />}>
      <MetricsToCustomerModule
        resourceName={instanceId}
        productType={productType}
        resourceURN={resourceURN}
        enableConfigurationManagement={false}
      />
    </Suspense>
  );
};

export default ObservabilityPage;
