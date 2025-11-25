import { Link } from 'react-router-dom';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_NAME } from '@/Tracking.constants';
import { urls } from '@/routes/Routes.constants';

type ServiceNameCellProps = {
  serviceName: string;
};

export default function ServiceNameCell({ serviceName }: ServiceNameCellProps) {
  const { trackClick } = useOvhTracking();

  const handleClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: [APP_NAME, 'listing', 'go-to-service'],
    });
  };

  return (
    <Link
      to={`../${urls.dashboard.replace(':serviceName', serviceName)}`}
      onClick={handleClick}
      className="text-primary hover:underline"
    >
      {serviceName}
    </Link>
  );
}
