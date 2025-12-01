import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import Flag from '../flag/Flag.component';

const RegionWithFlag = ({ region }: { region: Region }) => {
  const { translateMicroRegion } = useTranslatedMicroRegions();
  return (
    <div className="flex items-center gap-2">
      <Flag className='shrink-0' flagName={region?.countryCode} />
      <span className="break-words">
        {translateMicroRegion(region.name)}
      </span>
    </div>
  );
};

export default RegionWithFlag;
