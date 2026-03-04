import { FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { useProjectId } from '@/hooks/project/useProjectId';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { MetricsToCustomerModule } from '@ovh-ux/metrics-to-customer';

import '@ovh-ux/metrics-to-customer/dist/index.scss';
import { ICON_NAME, Message, MESSAGE_COLOR, MessageBody, MessageIcon, Spinner } from '@ovhcloud/ods-react';
import { useIsObservabilityAvailable } from '@/data/hooks/feature';

const ObservabilityPage: FC = () => {

  const { t } = useTranslation(['observability']);

  const projectId = useProjectId();

  const { instanceId } = useInstanceParams();

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
  const resourceURN = `urn:v1:eu:resource:publicCloudProject:${projectId}/instance/${instanceId}`;

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
