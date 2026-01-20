import { Outlet, useNavigate } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import ServicesDropDown from '@/components/services/dropdown/ServicesDropDown.component';
import { ServicesNavigationProps } from '@/components/services/navigation/ServicesNavigation.props';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';

const ServicesNavigation = ({ button, rootUrl }: ServicesNavigationProps) => {
  const navigate = useNavigate();
  const { services, isLoading } = useObservabilityServiceContext();

  return (
    <RedirectionGuard
      condition={!services || services.length === 0}
      isLoading={isLoading}
      route={urls.onboarding}
    >
      <div className="mb-6 flex items-center justify-end">
        <ServicesDropDown onChange={() => navigate(rootUrl)} />
        {button && <div className="whitespace-nowrap">{button}</div>}
      </div>
      <Outlet />
    </RedirectionGuard>
  );
};

export default ServicesNavigation;
