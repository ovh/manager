import { FC, Suspense } from 'react';
import { ObservabilityToCustomerModule } from '@ovh-ux/observability-to-customer';
import { useInstanceParams } from '../../action/hooks/useInstanceActionModal';
import '@ovh-ux/observability-to-customer/dist/style.css';

const ObservabilityPage: FC = () => {
  const { instanceId } = useInstanceParams();

  return (
    <Suspense fallback="loading observability module ...">
      <ObservabilityToCustomerModule
        resourceName={instanceId}
        productType="instances"
      />
    </Suspense>
  );
};

export default ObservabilityPage;
