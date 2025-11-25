import { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_NAME } from '@/Tracking.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/Nasha.constants';

type PartitionNameCellProps = {
  partitionName: string;
};

function PartitionNameCell({ partitionName }: PartitionNameCellProps) {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const handleClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'show'],
    });
    void navigate(`../partition/${partitionName}`);
  };

  return (
    <button type="button" onClick={handleClick} className="text-primary hover:underline">
      {partitionName}
    </button>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(PartitionNameCell);
