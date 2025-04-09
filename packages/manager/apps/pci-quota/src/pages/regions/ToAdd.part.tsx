import { OdsSelect, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { TPlainLocation } from '@/pages/regions/Regions.page';

export type ToAddPartProps = {
  selectedRegions: Record<string, string>;
  setSelectedRegion: (location: string, region: string) => void;
  locations: TPlainLocation[];
  isPending: boolean;
  selectedLocation: TPlainLocation;
  onInput: (location: TPlainLocation) => void;
  isMobile: boolean;
};
export const ToAddPart = ({
  selectedRegions,
  setSelectedRegion,
  locations,
  isPending,
  onInput,
  selectedLocation,
  isMobile,
}: ToAddPartProps): JSX.Element => {
  const { t } = useTranslation('regions');
  return (
    <div>
      <div className="mt-10">
        <OdsText preset="heading-6" className="text-[#00185e]">
          {t('pci_projects_project_regions_available_to_add_title')}
        </OdsText>
      </div>
      {isPending ? (
        <OdsSpinner data-testid="toadd-spinner" />
      ) : (
        <>
          {locations?.length ? (
            <ShapesInputComponent<TPlainLocation>
              value={selectedLocation}
              onInput={onInput}
              className="mt-6"
              items={locations}
              group={{
                by: (item) => item.continent || 'M',
                LabelComponent: ({ groupName, isGroupSelected }) => (
                  <div>
                    <OdsText
                      preset="heading-6"
                      className={`p-5 shape-input-group-label ${
                        isGroupSelected ? 'active' : ''
                      }`}
                    >
                      {groupName || 'All locations'}{' '}
                    </OdsText>
                  </div>
                ),
              }}
              item={{
                LabelComponent: ({ item }) => (
                  <div className="p-5 h-full">
                    <div>
                      <OdsText>{item.name}</OdsText>
                    </div>
                    <div className="border border-solid border-[--ods-color-primary-200] border-b-0 border-l-0 border-r-0 mt-4 pt-4">
                      {item.regions.length === 1 ? (
                        <OdsText preset="caption">
                          {item.name} ({item.regions[0]})
                        </OdsText>
                      ) : (
                        <OdsSelect
                          name="region"
                          data-testid="region-select"
                          value={selectedRegions[item.name]}
                          onOdsChange={(event) => {
                            if (
                              event.target.value !== selectedRegions[item.name]
                            ) {
                              onInput(item);
                              setSelectedRegion(
                                item.name,
                                event.target.value as string,
                              );
                            }
                          }}
                        >
                          {item.regions.map((region) => (
                            <option key={region} value={region}>
                              {item.name} ({region})
                            </option>
                          ))}
                        </OdsSelect>
                      )}
                    </div>
                  </div>
                ),
                getId: (item) => item.name,
              }}
              isMobile={isMobile}
            />
          ) : (
            <OdsText className="pt-8 pb-8">
              {t('pci_projects_project_regions_all_added')}
            </OdsText>
          )}
        </>
      )}
    </div>
  );
};
