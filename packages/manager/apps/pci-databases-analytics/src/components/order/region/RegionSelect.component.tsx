import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  ScrollArea,
  ScrollBar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  RadioGroup,
  RadioTile,
} from '@datatr-ux/uxlib';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Region } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';
import useHorizontalScroll from '@/hooks/useHorizontalScroll.hook';
import { RegionTypeEnum } from '@/types/cloud/project/database/capabilities/RegionTypeEnum';
import Flag from '@/components/flag/Flag.component';
import { getRegionFlag } from '@/lib/flagHelper';
import { cn } from '@/lib/utils';
import A from '@/components/links/A.component';

interface RegionsSelectProps {
  regions: Region[];
  value: string;
  onChange: (newRegion: string) => void;
}
interface MappedRegions extends Region {
  label: string;
  continent: string;
}
const RegionsSelect = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange }, ref) => {
    const [selectedContinentIndex, setSelectedContinentIndex] = useState(0);
    const { t } = useTranslation('regions');
    const scrollRef = useHorizontalScroll();

    const mappedRegions: MappedRegions[] = regions.map((r) => ({
      label: t(`region_${r.name}_micro`, { micro: r.name }),
      continent: t(`region_continent_${r.name}`),
      ...r,
    }));
    const continents = [
      ...new Set([
        t(`region_continent_all`),
        ...mappedRegions.map((mr) => mr.continent),
      ]),
    ];
    const RegionTypeBadge = ({ region }: { region: MappedRegions }) => {
      const helpLink = (
        <A
          href="https://www.ovhcloud.com/fr/about-us/global-infrastructure/expansion-regions-az/"
          className="flex gap-1 items-center"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t('help-link-more-info')}
          <ExternalLink className="size-3" />
        </A>
      );
      switch (region.type) {
        case RegionTypeEnum['1AZ']:
          return (
            <Badge className="bg-primary-400 text-white">
              <span>1-AZ</span>
              <Popover>
                <PopoverTrigger asChild>
                  <HelpCircle className="size-4 ml-2" />
                </PopoverTrigger>
                <PopoverContent className="text-xs">
                  {t('region-description-1AZ')}
                  {helpLink}
                </PopoverContent>
              </Popover>
            </Badge>
          );
        case RegionTypeEnum['3AZ']:
          return (
            <Badge className="bg-primary-500 text-white">
              <span>3-AZ</span>
              <Popover>
                <PopoverTrigger asChild>
                  <HelpCircle className="size-4 ml-2" />
                </PopoverTrigger>
                <PopoverContent className="text-xs">
                  {t('region-description-3AZ')}
                  {helpLink}
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
            <TabsList
              className={cn(
                'md:flex inline-flex w-fit items-center justify-center h-auto border-[#e6f5fc] border-b',
                'bg-transparent shadow-none rounded-none p-0',
              )}
            >
              {continents.map((continent, index) => (
                <TabsTrigger
                  key={continent}
                  value={`${index}`}
                  className={cn(
                    'bg-transparent shadow-none text-primary-[#e6f5fc] border-b-2 rounded-none font-semibold border-transparent text-primary',
                    'w-full px-6 flex gap-2 items-center',
                    'data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary',
                  )}
                >
                  {continent}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <RadioGroup
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-2"
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
                    <h5 className="flex gap-2 items-center">
                      <Flag flagName={getRegionFlag(region.name)} />
                      {region.label}
                    </h5>
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
                  <div className="flex w-full gap-2 justify-between mt-2">
                    <RegionTypeBadge region={region} />
                  </div>
                </RadioTile>
              ))}
          </RadioGroup>
        </Tabs>
      </div>
    );
  },
);

RegionsSelect.displayName = 'RegionsSelect';
export default RegionsSelect;
