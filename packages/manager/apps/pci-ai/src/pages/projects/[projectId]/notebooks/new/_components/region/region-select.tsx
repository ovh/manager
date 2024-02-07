import { ai } from '@/models/types';
import { useState } from 'react';
import { Tabs, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';
import RadioTile from '@/components/radio-tile';

const REGIONS_PER_CONTINENT = {
  all: [],
  'north-america': ['BHS'],
  'west-europe': ['GRA'],
};

interface RegionSelectProps {
  selectedRegion: ai.capabilities.Region;
  listRegions: ai.capabilities.Region[];
  onChange: (region: ai.capabilities.Region) => void;
}
type Continent = 'all' | 'north-america'| 'west-europe';
const RegionSelect = ({
  selectedRegion,
  listRegions,
  onChange,
}: RegionSelectProps) => {
  const [selectedContinent, setSelectectedContinent] = useState<Continent>(
    'all',
  );
  return (
    <Tabs
      defaultValue="all"
      onValueChange={(v) => setSelectectedContinent(v as Continent)}
    >
      <TabsList className="flex bg-white justify-start p-0">
        {Object.entries(REGIONS_PER_CONTINENT).map(([continent]) => (
          <TabsTrigger
            key={continent}
            value={continent}
            className="-mb-[1px] px-4 text-lg text-primary-600 font-semibold h-full bg-white border border-primary-100 rounded-t-md rounded-b-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:bg-primary-50 data-[state=active]:border-b-primary-50 data-[state=active]:font-bold data-[state=active]:text-primary-800"
          >
            {continent}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 bg-primary-50 border border-primary-100 rounded-b-md">
      {listRegions
          .filter((r) =>
            selectedContinent === 'all'
              ? true
              : REGIONS_PER_CONTINENT[selectedContinent].includes(r.id),
          )
          .map((region : ai.capabilities.Region) => (
            <RadioTile
              name="region-select"
              key={region.id}
              onChange={() => onChange(region)}
              value={region.id}
              checked={region === selectedRegion}
            >
              <span
                className={`${
                  region === selectedRegion ? 'font-bold' : ''
                }`}
              >
                {region.id}
              </span>
            </RadioTile>
          ))}
      </div>
    </Tabs>
  );
};

export default RegionSelect;