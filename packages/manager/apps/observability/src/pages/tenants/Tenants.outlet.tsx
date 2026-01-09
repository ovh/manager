import { Outlet, useNavigate } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import GrafanaButton from '@/components/metrics/grafana-button/GrafanaButton.component';
import ServicesDropDown from '@/components/services/ServicesDropDown.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';

const TenantsOutlet = () => {
  const navigate = useNavigate();
  const { services, isLoading } = useObservabilityServiceContext();

  return (
    <RedirectionGuard
      condition={!services || services.length === 0}
      isLoading={isLoading}
      route={urls.onboarding}
    >
      <div className="mb-6 flex items-center justify-end">
        <ServicesDropDown onChange={() => navigate(urls.tenants)} />
        <div className="whitespace-nowrap">
          <GrafanaButton />
        </div>
      </div>
      <Outlet />
    </RedirectionGuard>
  );
};

export default TenantsOutlet;
