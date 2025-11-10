import { useNavigate } from 'react-router-dom';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_NAME } from '@/Tracking.constants';
import { urls } from '@/routes/Routes.constants';

type ServiceNameCellProps = {
  serviceName: string;
};

export default function ServiceNameCell({ serviceName }: ServiceNameCellProps) {
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
    <button type="button" onClick={handleNavigate} className="text-primary hover:underline">
      {serviceName}
    </button>
  );
}
