import {
  OdsButton,
  OdsMessage,
  OdsText,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Headers,
  Notifications,
  PciGuidesHeader,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { useMedia } from 'react-use';
import { isDiscoveryProject } from '@ovh-ux/manager-pci-common/src';
import { AvailablePart } from '@/pages/regions/Available.part';
import { ToAddPart } from '@/pages/regions/ToAdd.part';
import { useGetProjectRegions, useLocations } from '@/api/hooks/useRegions';
import { addRegion } from '@/api/data/region';
import queryClient from '@/queryClient';
import { TabsComponent } from '@/components/tabs/Tabs.component';

export type TPlainLocation = {
  name: string;
  continent: string;
  regions: string[];
};

type TState = {
  isAddingRegion: boolean;
};

export default function RegionsPage(): JSX.Element {
  const { t } = useTranslation('regions');
  const [state, setState] = useState<TState>({ isAddingRegion: false });

  const isMobile: boolean = useMedia(`(max-width: 760px)`);

  const hrefProject = useProjectUrl('public-cloud');

  const { addSuccess, addError } = useNotifications();

  const { projectId } = useParams();
  const { data: project } = useProject();

  const { data: availableRegions } = useGetProjectRegions(projectId, true);

  const { data: locations } = useLocations(projectId, true);

  const [selectedLocation, setSelectedLocation] = useState<TPlainLocation>(
    undefined,
  );

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
    setState({ ...state, isAddingRegion: true });
    try {
      const code = selectedRegions[selectedLocation.name];
      await addRegion(projectId, code);
      queryClient.setQueryData(
        ['project', projectId, 'regions', 'available'],
        availableRegions.filter((region) => region.name !== code),
      );

      setSelectedLocation(undefined);

      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'regions'],
      });

      addSuccess(
        <OdsText>
          {t('pci_projects_project_regions_add_region_success', {
            code,
          })}
        </OdsText>,
      );
    } catch (e) {
      addError(
        <OdsText>
          {t('pci_projects_project_regions_add_region_error', {
            message: e?.response?.data?.message,
          })}
          ,
        </OdsText>,
      );
    } finally {
      setState({ ...state, isAddingRegion: false });
    }
  };

  return (
    <div>
      {project && (
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project.description} />
          <OdsBreadcrumbItem
            label={t('pci_projects_project_regions')}
            href={''}
          />
        </OdsBreadcrumb>
      )}

      <div className="header mt-8">
        <Headers
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="instances" />
            </div>
          }
        />
      </div>
      <PciAnnouncementBanner projectId={projectId} />
      <div className="my-10 mt-8">
        <TabsComponent activeTab={'regions'} />
      </div>
      <Notifications />
      <div>
        <OdsText preset="heading-3">
          {t('pci_projects_project_regions_title')}
        </OdsText>
      </div>

      <PciDiscoveryBanner project={project} />

      <OdsText preset="paragraph" className="pt-6">
        {t('pci_projects_project_regions_description')}
      </OdsText>

      <div>
        <OdsMessage
          color="information"
          className="mt-6 mb-6 w-full"
          isDismissible={false}
        >
          {t('pci_projects_project_regions_info_message')}
        </OdsMessage>
      </div>

      <div>
        <AvailablePart isMobile={isMobile} />
        <ToAddPart
          selectedRegions={selectedRegions}
          setSelectedRegion={setSelectedRegion}
          onInput={setSelectedLocation}
          locations={locations}
          selectedLocation={selectedLocation}
          isMobile={isMobile}
        />
      </div>
      {locations?.length !== 0 && (
        <div className="mt-12">
          <OdsButton
            label={t('pci_projects_project_regions_add_region')}
            onClick={doAddRegion}
            isDisabled={!selectedLocation || isDiscoveryProject(project)}
            isLoading={state.isAddingRegion}
          />
        </div>
      )}
    </div>
  );
}
