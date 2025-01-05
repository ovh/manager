import { OdsSelect, OdsText } from '@ovhcloud/ods-components/react';
import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { TPlainLocation } from '@/pages/regions/Regions.page';

export type ToAddPartProps = {
  selectedRegions: Record<string, string>;
  setSelectedRegion: (location: string, region: string) => void;
  locations: TPlainLocation[];
  onInput: (location: TPlainLocation) => void;
};
export const ToAddPart = ({
  selectedRegions,
  setSelectedRegion,
  locations,
  onInput,
}: ToAddPartProps): JSX.Element => {
  return (
    <div>
      <div className="mt-10">
        <OdsText preset="heading-6" className="text-[#00185e]">
          Locations you can add
        </OdsText>
      </div>
      <ShapesInputComponent<TPlainLocation>
        onInput={onInput}
        className="mt-6"
        items={locations}
        group={{
          by: (item) => item.continent || 'M',
          LabelComponent: ({ groupName, isGroupSelected }) => (
            <div>
              <OdsText
                preset="heading-6"
                className={`p-5 ${
                  isGroupSelected ? 'text-[#4d5592]' : 'text-[#0050d7]'
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
              <div className="border border-solid border-[--ods-color-blue-200] border-b-0 border-l-0 border-r-0 mt-4 pt-4">
                {item.regions.length === 1 ? (
                  <OdsText preset="caption">{item.regions[0]}</OdsText>
                ) : (
                  <OdsSelect
                    name="region"
                    value={selectedRegions[item.name]}
                    onOdsChange={(event) => {
                      if (event.target.value !== selectedRegions[item.name]) {
                        setSelectedRegion(
                          item.name,
                          event.target.value as string,
                        );
                      }
                    }}
                  >
                    {item.regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </OdsSelect>
                )}
              </div>
            </div>
          ),
          getId: (item) => item.name,
        }}
      />
    </div>
  );
};
