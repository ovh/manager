import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  ScrollArea,
  ScrollBar,
  Separator,
  Popover,
  PopoverTrigger,
  PopoverContent,
  RadioGroup,
  RadioTile,
} from '@datatr-ux/uxlib';
import { HelpCircle } from 'lucide-react';
import { Region } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';
import useHorizontalScroll from '@/hooks/useHorizontalScroll.hook';
import { TagEnum } from '@/types/cloud/project/database/capabilities/TagEnum';
import { cn } from '@/lib/utils';

interface RegionsSelectProps {
  regions: Region[];
  value: string;
  onChange: (newRegion: string) => void;
}
interface MappedRegions {
  name: string;
  tags: TagEnum[];
  type: string;
  label: string;
  continent: string;
}

const RegionsSelect2 = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange }, ref) => {
    const [selectedContinentIndex, setSelectedContinentIndex] = useState(0);
    const { t } = useTranslation('regions');
    const scrollRef = useHorizontalScroll();

    const mappedRegions: MappedRegions[] = regions.map((r) => ({
      name: r.name,
      tags: r.tags,
      type: r.type,
      label: t(`region_${r.name}_micro`, { micro: r.name }),
      continent: t(`region_continent_${r.name}`),
    }));
    const continents = [
      ...new Set([
        t(`region_continent_all`),
        ...mappedRegions.map((mr) => mr.continent),
      ]),
    ];

    const RegionTypeBadge = ({ region }: { region: MappedRegions }) => {
      switch (region.type) {
        case 'REGION-1-AZ':
          return (
            <Badge className="bg-primary-400 text-white">
              <span>1-AZ</span>
              <Popover>
                <PopoverTrigger asChild>
                  <HelpCircle className="size-4 ml-2" />
                </PopoverTrigger>
                <PopoverContent>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Debitis nam sit quidem?
                </PopoverContent>
              </Popover>
            </Badge>
          );
        case 'REGION-3-AZ':
          return (
            <Badge className="bg-primary-500 text-white">
              <span>3-AZ</span>
              <Popover>
                <PopoverTrigger asChild>
                  <HelpCircle className="size-4 ml-2" />
                </PopoverTrigger>
                <PopoverContent>Lorem ipsum dolor sit amet.</PopoverContent>
              </Popover>
            </Badge>
          );
        case 'LOCAL-ZONE':
          return (
            <Badge className="bg-primary-200 text-text">
              <span>Local Zone</span>
              <Popover>
                <PopoverTrigger asChild>
                  <HelpCircle className="size-4 ml-2" />
                </PopoverTrigger>
                <PopoverContent>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </PopoverContent>
              </Popover>
            </Badge>
          );
        default:
          return <Badge className="bg-neutral-100 text-text">?</Badge>;
      }
    };
    return (
      <div data-testid="regions-select-container" ref={ref}>
        <Tabs
          defaultValue="0"
          onValueChange={(v) => setSelectedContinentIndex(+v)}
        >
          <ScrollArea data-testid="scrollbar" ref={scrollRef}>
            <TabsList className="bg-white justify-start p-0 hidden md:flex overflow-y-hidden rounded-none rounded-t-md">
              {continents.map((continent, index) => (
                <TabsTrigger
                  key={continent}
                  value={`${index}`}
                  className="-mb-[1px] px-4 text-lg text-primary-600 font-semibold h-full bg-white border border-primary-100 rounded-t-md rounded-b-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:bg-[#f5feff2b] data-[state=active]:border-b-bg-[#f5feff2b] data-[state=active]:font-bold data-[state=active]:text-primary-800"
                >
                  {continent}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <RadioGroup 
            className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 border border-primary-100 rounded-b-md bg-[#f5feff2b]"
            value={value}
            onValueChange={onChange}
          >
            {mappedRegions
              .filter((r) =>
                selectedContinentIndex === 0
                  ? true
                  : r.continent === continents[selectedContinentIndex],
              )
              .map((region) => (
                <RadioTile
                  data-testid={`regions-radio-tile-${region.name}`}
                  key={region.name}
                  value={region.name}
                >
                  <div className="flex w-full gap-2 justify-between">
                    <h5>{region.label}</h5>
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
                  <Separator className="my-2" />
                  <RegionTypeBadge region={region} />
                </RadioTile>
              ))}
          </RadioGroup>
        </Tabs>
      </div>
    );
  },
);

RegionsSelect2.displayName = 'RegionsSelect2';
export default RegionsSelect2;
