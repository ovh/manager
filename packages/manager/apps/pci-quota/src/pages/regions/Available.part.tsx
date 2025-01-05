import { OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { useParams } from 'react-router-dom';
import { useLocations } from '@/api/hooks/useRegions';
import { TPlainLocation } from '@/pages/regions/Regions.page';

export const AvailablePart = (): JSX.Element => {
  const { projectId } = useParams();

  const { data: locations } = useLocations(projectId);

  return (
    <div>
      <div>
        <OdsText preset="heading-6" className="text-[#00185e]">
          Locations available
        </OdsText>
      </div>
      <ShapesInputComponent<TPlainLocation>
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
                {groupName || 'All locations'}
              </OdsText>
            </div>
          ),
        }}
        item={{
          LabelComponent: ({ item }) => (
            <div className="p-5 h-full">
              <div className="flex">
                <div className="w-full">
                  <OdsText>{item.name}</OdsText>
                </div>
                <div>
                  <OdsIcon
                    name="circle-check"
                    className="text-4x text-4xl text-[green]"
                  ></OdsIcon>
                </div>
              </div>
              <ul className="p-0 m-0 list-none">
                {item.regions.map((region) => (
                  <li
                    key={region}
                    className="border border-solid border-[--ods-color-blue-200] border-b-0 border-l-0 border-r-0 mt-4 pt-4"
                  >
                    <OdsText preset="caption">{region}</OdsText>
                  </li>
                ))}
              </ul>
            </div>
          ),
          getId: (item) => item.name,
          isDisabled: () => true,
        }}
      />
    </div>
  );
};
