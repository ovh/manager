import { useNavigate } from 'react-router-dom';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_NAME } from '@/Tracking.constants';

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
    // Navigate to dashboard using relative path from listing
    // Since listing and dashboard are sibling routes, we use relative path
    void navigate(`../dashboard/${serviceName}`);
  };

  return (
    <button type="button" onClick={handleNavigate} className="text-primary hover:underline">
      {serviceName}
    </button>
  );
};
