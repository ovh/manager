import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenants } from '@/data/hooks/tenants/useTenants';
import { Tenant } from '@/types/observability.type';

export default function TenantsListingPage() {
  const { t } = useTranslation(['common', 'tenants']);
  const { selectedService } = useObservabilityServiceContext();
  const { data: tenants, isSuccess } = useTenants(selectedService || '');

  // TODO : implement the listing page
  return tenants && isSuccess ? (
    <>
      <OdsText preset="heading-2">{t('tenants:listing.title')}</OdsText>
      <ul>
        {tenants.map((tenant: Tenant) => (
          <li key={tenant.id}>{tenant.currentState.title}</li>
        ))}
      </ul>
    </>
  ) : null;
}
