import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioTile } from '@datatr-ux/uxlib';
import ai from '@/types/AI';

interface RegionsSelectProps {
  regions: ai.capabilities.Region[];
  value: string;
  onChange: (newRegion: string) => void;
}

const RegionsSelect = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange }, ref) => {
    const { t: tRegions } = useTranslation('regions');
    return (
      <RadioGroup
        data-testid="regions-select-container"
        ref={ref}
        className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 rounded-b-md "
        value={value}
        onValueChange={onChange}
      >
        {regions.map((region) => (
          <RadioTile
            className="flex flex-col"
            data-testid={`region-tile-radio-tile-${region.id}`}
            key={`region-selet-${region.id}`}
            onChange={() => onChange(region.id)}
            value={region.id}
            checked={region.id === value}
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between w-full">
                <h5 className="capitalize">
                  <span>{tRegions(`region_${region.id}`)}</span>
                  <span>{` (${region.id})`}</span>
                </h5>
              </div>
            </div>
          </RadioTile>
        ))}
      </RadioGroup>
    );
  },
);
RegionsSelect.displayName = 'RegionsSelect';
export default RegionsSelect;
