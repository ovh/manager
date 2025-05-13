import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ShapesInputComponent,
  TRegion,
  TRegionAvailability,
  TileInputChoice,
  useGetProjectRegions,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { useMedia } from 'react-use';

import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { OBJECT_CONTAINER_OFFER_STORAGE_STANDARD } from '@/constants';
import { RegionLabel } from './RegionLabel.component';
import { useColumnsCount } from '@/hooks/useColumnsCount';

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

  const { projectId } = useParams();
  const columnsCount = useColumnsCount();
  const isMobileView = useMedia(`(max-width: 768px)`);

  const {
    data: availability,
    isPending: isAvailabilityPending,
  } = useProductAvailability(projectId);

  const {
    translateContinentRegion,
    translateMacroRegion,
    translateMicroRegion,
  } = useTranslatedMicroRegions();

  const {
    data: projectRegions,
    isPending: isProjectRegionsPending,
  } = useGetProjectRegions(projectId);

  const isPending = isAvailabilityPending || isProjectRegionsPending;

  const allowedRegions = useMemo(() => {
    if (isPending) return [];

    const allRegions = availability?.plans
      ?.filter(({ code }) => code.startsWith('storage'))
      .reduce((acc, { regions }) => [...acc, ...regions], []);

    const uniqueRegions = [
      ...new Set(allRegions?.map(({ name }) => name)),
    ].map((regionName) => allRegions?.find(({ name }) => name === regionName));

    const filteredRegions = uniqueRegions
      .filter(({ enabled }) => !isSwiftOffer || enabled === true)
      .filter(({ type }) => type === (deploymentMode || 'region'))
      .filter(({ name }) => {
        if (offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD) return true;
        return (
          !projectRegions?.find((pr) => pr.name === name) ||
          projectRegions
            ?.find((pr) => pr.name === name)
            ?.services.some(({ name: serviceName }) => serviceName === offer)
        );
      });

    return (
      filteredRegions
        // remove macro regions if a micro region is available
        .filter(({ name, datacenter }) => {
          if (
            name === datacenter &&
            filteredRegions.filter(({ datacenter: dc }) => dc === datacenter)
              .length > 1
          )
            return false;
          return true;
        })
        .map((reg) => ({
          ...reg,
          microName: translateMicroRegion(reg.name),
          macroName: translateMacroRegion(reg.name),
          continentName: translateContinentRegion(reg.name),
        }))
    );
  }, [availability, projectRegions, deploymentMode, isPending, t]);

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
