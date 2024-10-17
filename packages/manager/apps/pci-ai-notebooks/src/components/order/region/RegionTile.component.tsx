import { useTranslation } from 'react-i18next';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import * as ai from '@/types/cloud/project/ai';

export const RegionTile = ({
  region,
  selected,
  onChange,
}: {
  region: ai.capabilities.Region;
  selected: boolean;
  onChange: (newRegion: string) => void;
}) => {
  const { t: tRegions } = useTranslation('regions');
  return (
    <RadioTile
      data-testid="region-tile-radio-tile"
      name="region-select"
      onChange={() => onChange(region.id)}
      value={region.id}
      checked={selected}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between w-full">
          <h5
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            <span>{tRegions(`region_${region.id}`)}</span>
            <span>{` (${region.id})`}</span>
          </h5>
        </div>
      </div>
    </RadioTile>
  );
};

export default RegionTile;
