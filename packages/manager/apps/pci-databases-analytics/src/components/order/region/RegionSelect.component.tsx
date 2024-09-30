import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Region } from '@/types/orderFunnel';
import { Badge } from '@/components/ui/badge';
import { getTagVariant } from '@/lib/tagsHelper';

interface RegionsSelectProps {
  regions: Region[];
  value: string;
  onChange: (newRegion: string) => void;
}
const RegionsSelect = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange }, ref) => {
    const [selectedContinentIndex, setSelectedContinentIndex] = useState(0);
    const { t } = useTranslation('regions');

    const mappedRegions = regions.map((r) => ({
      name: r.name,
      tags: r.tags,
      label: t(`region_${r.name}_micro`, { micro: r.name }),
      continent: t(`region_continent_${r.name}`),
    }));
    const continents = [
      ...new Set([
        t(`region_continent_all`),
        ...mappedRegions.map((mr) => mr.continent),
      ]),
    ];
    return (
      <div data-testid="regions-select-container" ref={ref}>
        <Tabs
          defaultValue="0"
          onValueChange={(v) => setSelectedContinentIndex(+v)}
        >
          <TabsList className="bg-white justify-start p-0 hidden md:flex">
            {continents.map((continent, index) => (
              <TabsTrigger
                key={continent}
                value={`${index}`}
                className="-mb-[1px] px-4 text-lg text-primary-600 font-semibold h-full bg-white border border-primary-100 rounded-t-md rounded-b-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:bg-primary-50 data-[state=active]:border-b-primary-50 data-[state=active]:font-bold data-[state=active]:text-primary-800"
              >
                {continent}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 bg-primary-50 border border-primary-100 rounded-b-md">
            {mappedRegions
              .filter((r) =>
                selectedContinentIndex === 0
                  ? true
                  : r.continent === continents[selectedContinentIndex],
              )
              .map((region) => (
                <RadioTile
                  data-testid={`regions-radio-tile-${region.name}`}
                  name="region-select"
                  key={region.name}
                  onChange={() => onChange(region.name)}
                  value={region.name}
                  checked={region.name === value}
                >
                  <div className="flex w-full gap-2 justify-between">
                    <span
                      className={`${region.name === value ? 'font-bold' : ''}`}
                    >
                      {region.label}
                    </span>
                    <div className="flex gap-1">
                      {region.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={getTagVariant(tag)}
                          className="text-xs h-4"
                        >
                          {t(`regionTag-${tag}`, tag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </RadioTile>
              ))}
          </div>
        </Tabs>
      </div>
    );
  },
);

RegionsSelect.displayName = 'RegionsSelect';
export default RegionsSelect;
