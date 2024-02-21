import { useState } from 'react';
import RadioTile from '@/components/radio-tile';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';

const REGIONS_PER_CONTINENT = {
  all: [] as string[],
  'north-america': ['BHS'],
  'central-europe': ['DE', 'SBG', 'WAW'],
  'west-europe': ['GRA', 'UK'],
};

interface RegionsSelectProps {
  model: AvailabilitiesHookOutput;
}
type Continent = 'all' | 'north-america' | 'central-europe' | 'west-europe';
const RegionsSelect = ({ model }: RegionsSelectProps) => {
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
        {model.listRegions
          .sort((a, b) => a.order - b.order)
          .filter((r) =>
            selectedContinent === 'all'
              ? true
              : REGIONS_PER_CONTINENT[selectedContinent].includes(r.name),
          )
          .map((region) => (
            <RadioTile
              name="region-select"
              key={region.name}
              onChange={() => model.setRegion(region.name)}
              value={region.name}
              checked={region.name === model.region}
            >
              <span
                className={`${region.name === model.region ? 'font-bold' : ''}`}
              >
                {region.name}
              </span>
            </RadioTile>
          ))}
      </div>
    </Tabs>
  );
};

export default RegionsSelect;
