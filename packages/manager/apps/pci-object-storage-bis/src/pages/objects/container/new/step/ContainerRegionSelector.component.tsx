import { useMemo } from 'react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ShapesInputComponent,
  TRegion,
  TRegionAvailability,
  TileInputChoice,
} from '@ovh-ux/manager-pci-common';
import { useMedia } from 'react-use';

import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { RegionLabel } from './RegionLabel.component';
import { useColumnsCount } from '@/hooks/useColumnsCount';
import { useAllowedRegions } from '@/hooks/useAllowedRegions';

interface RegionSelectorProps {
  offer: string;
  deploymentMode: string;
  region: TRegionAvailability;
  onSelectRegion: (region: TRegionAvailability) => void;
  isSubmitted: boolean;
  isSwiftOffer: boolean;
  canActivateRegion?: boolean;
}

export function ContainerRegionSelector({
  offer,
  deploymentMode,
  region,
  onSelectRegion,
  isSubmitted,
  isSwiftOffer,
  canActivateRegion,
}: Readonly<RegionSelectorProps>) {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const columnsCount = useColumnsCount();
  const isMobileView = useMedia(`(max-width: 768px)`);

  const {
    translateContinentRegion,
    translateMacroRegion,
    translateMicroRegion,
  } = useTranslatedMicroRegions();

  const { allowedRegions: regions, isPending } = useAllowedRegions({
    offer,
    deploymentMode,
    onlyEnabled: !isSwiftOffer,
    removeMacroIfMicroAvailable: true,
  });

  const allowedRegions = useMemo(() => {
    return regions.map((reg) => ({
      ...reg,
      microName: translateMicroRegion(reg.name),
      macroName: translateMacroRegion(reg.name),
      continentName: translateContinentRegion(reg.name),
      status: 'UP',
      services: [],
      datacenterLocation: reg.datacenter || reg.name,
    }));
  }, [
    regions,
    translateMicroRegion,
    translateMacroRegion,
    translateContinentRegion,
  ]);

  const selectedRegion = useMemo(() => {
    const selected = allowedRegions.find(({ name }) => name === region?.name);
    return {
      ...selected,
      id: selected?.name,
    };
  }, [allowedRegions, region]);

  return (
    <>
      {isPending && <OdsSpinner />}
      {!isPending && !isSubmitted && (
        <ShapesInputComponent<
          TRegion & {
            microName: string;
            macroName: string;
            continentName: string;
          }
        >
          items={allowedRegions}
          onInput={(reg) =>
            onSelectRegion(
              allowedRegions.find(({ name }) => name === reg?.name),
            )
          }
          value={allowedRegions.find(({ name }) => name === region?.name)}
          columnsCount={3}
          item={{
            getId: (item) => item.name,
            LabelComponent: ({ item, isItemSelected }) => (
              <RegionLabel label={item.microName} isSelected={isItemSelected} />
            ),
          }}
          stack={{
            by: (item) => item?.macroName || '',
            LabelComponent: ({ stackKey, isStackSelected }) => (
              <RegionLabel label={stackKey} isSelected={isStackSelected} />
            ),
          }}
          group={{
            by: (item) => item.continentName,
            LabelComponent: ({ groupName, isMobile, isGroupSelected }) => (
              <div className="max-w-full p-4">
                <OdsText
                  preset="paragraph"
                  className={`overflow-hidden whitespace-nowrap text-ellipsis ${
                    isMobile || isGroupSelected ? 'font-bold' : ''
                  }`}
                >
                  {groupName ||
                    t(
                      'pci-region-selector:pci_project_regions_list_continent_all',
                    )}
                </OdsText>
              </div>
            ),
          }}
          isMobile={isMobileView}
        />
      )}
      {canActivateRegion && region && !region.enabled && (
        <OdsText className="my-6 text-critical font-bold-class">
          {t(
            'pci_projects_project_storages_containers_add_add_region_activate',
          )}
        </OdsText>
      )}
      {!isPending && isSubmitted && (
        <TileInputChoice
          items={[selectedRegion]}
          selectedItem={selectedRegion}
          columnsCount={columnsCount}
        >
          {(item) => <RegionLabel label={item.microName} />}
        </TileInputChoice>
      )}
    </>
  );
}
