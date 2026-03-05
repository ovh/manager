import { FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { useEnvironmentRegion } from '@/hooks/region/useEnvironmentRegion';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { MetricsToCustomerModule } from '@ovh-ux/metrics-to-customer';

import '@ovh-ux/metrics-to-customer/dist/index.scss';
import { ICON_NAME, Message, MESSAGE_COLOR, MessageBody, MessageIcon, Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';
import { useObservabilityAvailability } from '@/data/hooks/feature';

const ObservabilityPage: FC = () => {

  const { t } = useTranslation(['observability']);

  const envRegion = useEnvironmentRegion();

  const projectId = useProjectId();

  const { instanceId, region } = useInstanceParams();

  const {
    isObservabilityAvailable,
    isM2CAvailable,
    isPending: isObservabilityAvailabilityPending,
  } = useObservabilityAvailability();

  if (isObservabilityAvailabilityPending) {
    return <Spinner size={SPINNER_SIZE.xs} />
  }

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
  const resourceURN = `urn:v1:${envRegion}:resource:publicCloudProject:${projectId}/instance/${instanceId}`;

  const subscribeUrl = `/cloud/project/${projectId}/region/${region}/instance/${instanceId}/metric/subscription`;

  return (
    <Suspense fallback={<Spinner />}>
      <MetricsToCustomerModule
        resourceName={instanceId}
        productType={productType}
        resourceURN={resourceURN}
        enableConfigurationManagement={isM2CAvailable}
        subscriptionUrls={{
          subscribeUrl,
        }}
        defaultRetention="30d"
      />
    </Suspense>
  );
};

export default ObservabilityPage;
