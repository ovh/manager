import { useNavigate } from 'react-router-dom';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/Routes.constants';
import { APP_NAME } from '@/Tracking.constants';
import type { NashaService } from '@/types/Nasha.type';

export const ServiceNameCell = ({ serviceName }: { serviceName: string }) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const handleNavigate = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'listing', 'go-to-service'],
    });
    navigate(`../${urls.dashboard.replace(':serviceName', serviceName)}`);
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className="text-primary hover:underline"
    >
      {serviceName}
    </button>
  );
};

