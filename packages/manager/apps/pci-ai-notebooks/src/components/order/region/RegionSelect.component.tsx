import React from 'react';
import * as ai from '@/types/cloud/project/ai';
import { cn } from '@/lib/utils';
import RegionTile from './RegionTile.component';

interface RegionsSelectProps {
  regions: ai.capabilities.Region[];
  value: string;
  onChange: (newRegion: string) => void;
  className?: string;
}

const RegionsSelect = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange, className }, ref) => {
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
          <RegionTile
            key={region.id}
            region={region}
            selected={value === region.id}
            onChange={(newValue: string) => onChange(newValue)}
          />
        ))}
      </div>
    );
  },
);
RegionsSelect.displayName = 'RegionsSelect';
export default RegionsSelect;
