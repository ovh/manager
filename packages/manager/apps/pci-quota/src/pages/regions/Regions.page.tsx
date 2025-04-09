import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  addProjectRegion,
  isDiscoveryProject,
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  useGetProjectRegionsQuery,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { useMedia } from 'react-use';
import { AvailablePart } from '@/pages/regions/Available.part';
import { ToAddPart } from '@/pages/regions/ToAdd.part';
import {
  useAvailableLocations,
  useGetAvailableRegionsQuery,
} from '@/api/hooks/useRegions';
import queryClient from '@/queryClient';

export type TPlainLocation = {
  name: string;
  continent: string;
  regions: string[];
};

export default function RegionsPage(): JSX.Element {
  const { t } = useTranslation('regions');

  const [isAddingRegion, setIsAddingRegion] = useState<boolean>(false);

  const isMobile: boolean = useMedia(`(max-width: 760px)`);

  const { addSuccess, addError, clearNotifications } = useNotifications();

  const { projectId } = useParams();
  const { data: project } = useProject();

  const { data: locations, isPending } = useAvailableLocations(projectId);

  const [selectedLocation, setSelectedLocation] = useState<
    TPlainLocation | undefined
  >();

  const [selectedRegions, setSelectedRegions] = useState<
    Record<string, string>
  >({});

  const setSelectedRegion = (location: string, region: string) => {
    setSelectedRegions((prev) => ({ ...prev, [location]: region }));
  };

  useEffect(() => {
    locations?.forEach((location) => {
      setSelectedRegion(location.name, location.regions[0]);
    });
  }, [locations]);

  const doAddRegion = async () => {
    setIsAddingRegion(true);
    try {
      const code = selectedRegions[selectedLocation.name];
      await addProjectRegion(projectId, code);

      setSelectedLocation(undefined);

      await queryClient.invalidateQueries({
        queryKey: useGetAvailableRegionsQuery(projectId).queryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: useGetProjectRegionsQuery(projectId).queryKey,
      });

      clearNotifications();
      addSuccess(
        <Translation ns="regions">
          {(_t) => (
            <OdsText>
              {_t('pci_projects_project_regions_add_region_success', {
                code,
              })}
            </OdsText>
          )}
        </Translation>,
      );
    } catch (e) {
      clearNotifications();
      addError(
        <Translation ns="regions">
          {(_t) => (
            <OdsText>
              {_t('pci_projects_project_regions_add_region_error', {
                message: e?.response?.data?.message,
              })}
              ,
            </OdsText>
          )}
        </Translation>,
      );
    } finally {
      setIsAddingRegion(false);
    }
  };

  return (
    <>
      <PciAnnouncementBanner projectId={projectId} />

      <Notifications />
      <div>
        <OdsText preset="heading-3">
          {t('pci_projects_project_regions_title')}
        </OdsText>
      </div>

      <OdsText preset="paragraph" className="pt-6">
        {t('pci_projects_project_regions_description')}
      </OdsText>

      <div className={isMobile ? 'mb-5 sticky top-0 z-50' : ''}>
        <PciDiscoveryBanner project={project} />
      </div>

      {!isDiscoveryProject(project) && (
        <div>
          <OdsMessage
            color="information"
            className="mt-6 mb-6 w-full"
            isDismissible={false}
          >
            {t('pci_projects_project_regions_info_message')}
          </OdsMessage>
        </div>
      )}

      <div>
        <AvailablePart isMobile={isMobile} data-testid="available-part" />
        <ToAddPart
          selectedRegions={selectedRegions}
          setSelectedRegion={setSelectedRegion}
          onInput={setSelectedLocation}
          locations={locations}
          isPending={isPending}
          selectedLocation={selectedLocation}
          isMobile={isMobile}
        />
      </div>
      {locations?.length !== 0 && (
        <div className="mt-12">
          <OdsButton
            label={t('pci_projects_project_regions_add_region')}
            data-testid="add-region-button"
            onClick={doAddRegion}
            isDisabled={!selectedLocation || isDiscoveryProject(project)}
            isLoading={isAddingRegion}
          />
        </div>
      )}
    </>
  );
}
