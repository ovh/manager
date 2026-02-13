import { Trans, useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  Badge,
  RadioGroup,
  RadioTile,
  RadioIndicator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Alert,
  Checkbox,
  Label,
} from '@datatr-ux/uxlib';
import { Region, RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import {
  DeploymentModeSelection,
  getDefaultDeploymentModes,
} from './RegionDeploymentSelection.component';
import cloud from '@/types/Cloud';
import OvhLink from '@/components/links/OvhLink.component';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import { RegionTypeBadgeWithPopover } from '@/components/region-type-badge/RegionTypeBadge.component';
import RegionWithFlag from '@/components/region-with-flag/RegionWithFlag.component';
import { Region3AZ } from '@/configuration/region.const';

interface RegionsSelectProps {
  regions: Region[];
  value: string;
  onChange: (newRegion: string) => void;
}
export interface MappedRegions extends Region {
  label: string;
  continent: string;
  type: cloud.RegionTypeEnum;
}

const RegionsOvhLink = ({
  projectId,
  children,
}: {
  projectId: string;
  children?: React.ReactNode;
}) => (
  <OvhLink
    application="public-cloud"
    path={`#/pci/projects/${projectId}/regions`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </OvhLink>
);

const RegionsStep = React.forwardRef<HTMLInputElement, RegionsSelectProps>(
  ({ regions, value, onChange }, ref) => {
    const [shouldFilterRegion, setShouldFilterRegion] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState<string>('');
    const [selectedDeploymentModes, setSelectedDeploymentModes] = useState<
      cloud.RegionTypeEnum[]
    >(getDefaultDeploymentModes());
    const { t } = useTranslation('regions');
    const { t: tOrder } = useTranslation('pci-object-storage/order-funnel');
    const RECOMENDED_REGION = Region3AZ.PARIS;
    const { data: project } = usePciProject();
    const MAX_DISPLAYED_REGIONS = 12;

    const {
      translateContinentRegion,
      translateMicroRegion,
    } = useTranslatedMicroRegions();

    const mappedRegions: MappedRegions[] = regions.map((r) => ({
      label: translateMicroRegion(r.name),
      continent: translateContinentRegion(r.name),
      ...r,
    }));

    const regionsFilteredByDeployment = mappedRegions.filter((r) => {
      return selectedDeploymentModes.length === 0
        ? true
        : selectedDeploymentModes.includes(r.type);
    });

    const continents = [
      ...new Set([
        t(`region_continent_all`),
        ...regionsFilteredByDeployment.map((mr) => mr.continent).toSorted(),
      ]),
    ];

    const filteredRegions = mappedRegions.filter((r) => {
      // Filter by continent
      const matchesContinent =
        !selectedContinent || selectedContinent === continents[0]
          ? true
          : r.continent === selectedContinent;

      // Filter by deployment modes - if no modes selected, show all regions
      const matchesDeploymentMode =
        selectedDeploymentModes.length === 0
          ? true
          : selectedDeploymentModes.includes(r.type);

      return matchesContinent && matchesDeploymentMode;
    });

    const mappedRegionsFiltered = shouldFilterRegion
      ? filteredRegions
      : filteredRegions.slice(0, MAX_DISPLAYED_REGIONS);

    const handleDeploymentModeChange = (
      newDeploymentModes: cloud.RegionTypeEnum[],
    ) => {
      setSelectedDeploymentModes(newDeploymentModes);

      const newRegionsFilteredByDeployment = mappedRegions.filter((r) => {
        return newDeploymentModes.length === 0
          ? true
          : newDeploymentModes.includes(r.type);
      });

      const newContinents = [
        ...new Set([
          t(`region_continent_all`),
          ...newRegionsFilteredByDeployment
            .map((mr) => mr.continent)
            .toSorted(),
        ]),
      ];

      if (selectedContinent && !newContinents.includes(selectedContinent)) {
        setSelectedContinent('');
      }
    };

    return (
      <div data-testid="regions-select-container" ref={ref}>
        <DeploymentModeSelection
          value={selectedDeploymentModes}
          onChange={handleDeploymentModeChange}
        />
        <div className="my-4 flex justify-between">
          <div className="gap-2">
            <h5>{tOrder('selectGeographicalZone')}</h5>
            <Select
              value={selectedContinent || continents[0]}
              onValueChange={setSelectedContinent}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder={t(`region_continent_all`)} />
              </SelectTrigger>
              <SelectContent>
                {continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-region"
              disabled={filteredRegions.length <= MAX_DISPLAYED_REGIONS}
              checked={
                filteredRegions.length <= MAX_DISPLAYED_REGIONS ||
                shouldFilterRegion
              }
              onClick={() => setShouldFilterRegion((val) => !val)}
            />
            <Label htmlFor="filter-regin">{tOrder('showAllRegions')}</Label>
          </div>
        </div>

        {mappedRegionsFiltered.length ? (
          <ScrollArea className="max-h-[480px] w-full overflow-y-auto">
            <RadioGroup
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-2 p-[1px]"
              value={value}
              onValueChange={onChange}
            >
              {mappedRegionsFiltered
                .sort((a, b) => {
                  const priority: Record<string, number> = {
                    [RegionTypeEnum['region-3-az']]: 0,
                    [RegionTypeEnum.region]: 1,
                  };

                  const aPriority = priority[a.type] ?? 2;
                  const bPriority = priority[b.type] ?? 2;

                  if (aPriority !== bPriority) {
                    return aPriority - bPriority;
                  }
                  return a.name.localeCompare(b.name);
                })
                .map((region) => (
                  <RadioTile
                    data-testid={`regions-radio-tile-${region.name}`}
                    key={region.name}
                    value={region.name}
                  >
                    <div className="flex w-full gap-2 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <RadioIndicator />
                        <h5 className="flex gap-2 items-center">
                          <RegionWithFlag region={region} />
                        </h5>
                      </div>
                    </div>
                    <div className="flex w-full gap-2 justify-between mt-2">
                      <RegionTypeBadgeWithPopover type={region.type} />
                      <div className="flex gap-1">
                        {region.name === RECOMENDED_REGION && (
                          <Badge variant="information">
                            {tOrder('regionRecommended')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </RadioTile>
                ))}
            </RadioGroup>
          </ScrollArea>
        ) : (
          <Alert variant="information">
            <Trans
              i18nKey={`regionsNoMatch`}
              ns={'pci-object-storage/order-funnel'}
              components={[<RegionsOvhLink projectId={project.project_id} />]}
            />
          </Alert>
        )}
        {filteredRegions.length ? (
          <div className="text-xs mt-2 italic">
            <Trans
              i18nKey={`regionActivationInfo`}
              ns={'pci-object-storage/order-funnel'}
              components={[<RegionsOvhLink projectId={project.project_id} />]}
            />
          </div>
        ) : null}
      </div>
    );
  },
);

RegionsStep.displayName = 'RegionsStep';
export default RegionsStep;
