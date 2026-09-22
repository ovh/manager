import { FC } from 'react';
import { useRepricingInstancesAvailable } from '@/hooks/repricing/useRepricingInstancesAvailable';
import { useInstanceCreation } from '../../hooks/useInstanceCreation';
import { Volumes } from './Volumes.component';

const VolumesBlock: FC = () => {
  const hasRepricing = useRepricingInstancesAvailable();
  const { instanceData } = useInstanceCreation();

  if (!hasRepricing || !instanceData.flavorDetails) return null;

  return (
    <Volumes
      disks={instanceData.flavorDetails.disks}
      hourlyPrice={instanceData.flavorDetails.localDiskPrice}
    />
  );
};

export default VolumesBlock;
