import { OdsIcon, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocations } from '@/api/hooks/useRegions';
import { TPlainLocation } from '@/pages/regions/Regions.page';

export const AvailablePart = ({
  isMobile,
}: {
  isMobile: boolean;
}): JSX.Element => {
  const { projectId } = useParams();

  const { t } = useTranslation('regions');

  const { data: locations, isPending } = useLocations(projectId);

  return (
    <div>
      <div>
        <OdsText preset="heading-6">
          {t('pci_projects_project_regions_added_title')}
        </OdsText>
      </div>
      {isPending ? (
        <OdsSpinner data-testid="available-spinner" />
      ) : (
        <ShapesInputComponent<TPlainLocation>
          className="mt-6"
          items={locations}
          group={{
            by: (item) => item.continent || 'M',
            LabelComponent: ({ groupName, isGroupSelected }) => (
              <OdsText
                preset="heading-6"
                className={`p-5 shape-input-group-label ${
                  isGroupSelected ? 'active' : ''
                }`}
              >
                {groupName || t('pci_projects_project_regions_all_added')}
              </OdsText>
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
                      className="border border-solid border-[--ods-color-primary-200] border-b-0 border-l-0 border-r-0 mt-4 pt-4"
                    >
                      <OdsText preset="caption">
                        {item.name} ({region})
                      </OdsText>
                    </li>
                  ))}
                </ul>
              </div>
            ),
            getId: (item) => item.name,
            isDisabled: () => true,
          }}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};
