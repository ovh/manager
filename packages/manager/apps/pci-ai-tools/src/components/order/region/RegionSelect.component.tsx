import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import ai from '@/types/AI';

interface RegionsSelectProps {
  regions: ai.capabilities.Region[];
  value: string;
  onChange: (newRegion: string) => void;
  className?: string;
}

const RegionsSelect = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange, className }, ref) => {
    const { t: tRegions } = useTranslation('regions');
    return (
      <div
        data-testid="regions-select-container"
        ref={ref}
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2',
          className,
        )}
      >
        {regions.map((region) => (
          <RadioTile
            data-testid={`region-tile-radio-tile-${region.id}`}
            name="region-select"
            key={`region-selet-${region.id}`}
            onChange={() => onChange(region.id)}
            value={region.id}
            checked={region.id === value}
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between w-full">
                <span
                  className={`capitalize text-lg ${
                    region.id === value ? 'font-bold' : 'font-normal'
                  }`}
                >
                  <span>{tRegions(`region_${region.id}`)}</span>
                  <span>{` (${region.id})`}</span>
                </span>
              </div>
            </div>
          </RadioTile>
        ))}
      </div>
    );
  },
);
RegionsSelect.displayName = 'RegionsSelect';
export default RegionsSelect;
