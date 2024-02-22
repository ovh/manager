import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import RadioTile from '@/components/radio-tile';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Region } from '@/models/order-funnel';

interface RegionsSelectProps {
  regions: Region[];
  value: string;
  onChange: (newRegion: string) => void;
}
const RegionsSelect = ({ regions, value, onChange }: RegionsSelectProps) => {
  const [selectedContinentIndex, setSelectectedContinentIndex] = useState(0);
  const { t } = useTranslation('regions');
  const mappedRegions = regions
    .sort((a, b) => a.order - b.order)
    .map((r) => ({
      name: r.name,
      // regionItem: r,
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
    <Tabs
      defaultValue="0"
      onValueChange={(v) => setSelectectedContinentIndex(+v)}
    >
      <TabsList className="flex bg-white justify-start p-0">
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
              name="region-select"
              key={region.name}
              onChange={() => onChange(region.name)}
              value={region.name}
              checked={region.name === value}
            >
              <span className={`${region.name === value ? 'font-bold' : ''}`}>
                {region.label}
              </span>
            </RadioTile>
          ))}
      </div>
    </Tabs>
  );
};

export default RegionsSelect;
