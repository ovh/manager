import { useEffect } from 'react';

import { useMatches, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import MetricsResourceBaseLayout from '@/pages/metrics/MetricsResourceBase.layout';
import { LocationPathParams } from '@/routes/Routes.constants';
import { LABELS } from '@/utils/labels.constants';

type RouteHandle = {
  titleKey?: string;
};

export default function TenantLayout() {
  const { t } = useTranslation(['tenants', 'shared']);
  const { selectedService, setSelectedService, services } = useObservabilityServiceContext();
  const { tenantId, resourceName } = useParams<LocationPathParams>();

  useEffect(() => {
    if (resourceName && !selectedService) {
      setSelectedService(services?.find((service) => service.id === resourceName) ?? undefined);
    }
  }, [resourceName, selectedService, services, setSelectedService]);

  const { data: tenant } = useTenant(selectedService?.id ?? '', tenantId ?? '');
  const matches = useMatches();
  const currentMatch = matches.find((match) => (match.handle as RouteHandle)?.titleKey);
  const titleKey = (currentMatch?.handle as RouteHandle)?.titleKey;
  const title = titleKey
    ? t(`tenants:${titleKey}`)
    : (tenant?.currentState?.title ?? LABELS.TENANT);

  return <MetricsResourceBaseLayout title={title} />;
}
