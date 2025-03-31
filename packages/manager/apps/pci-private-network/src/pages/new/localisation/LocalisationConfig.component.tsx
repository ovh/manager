import { useCallback, useMemo, useState } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  RegionSelector,
  useProject,
  PCICommonContext,
  usePCICommonContextFactory,
  useProjectRegions,
  TRegion,
  TDeployment,
  TLocalisation,
  FeaturedDeploymentTilesInput,
} from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const isNetworkUp = (services: TRegion['services']) =>
  services.some(
    (service) => service.name === 'network' && service.status === 'UP',
  );

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some(
    (region) => region.type === 'region-3-az' && isNetworkUp(region.services),
  );

const LocalisationConfig: React.FC = () => {
  const { t } = useTranslation('new');
  const { data: project } = useProject();
  const { unregister, setValue } = useFormContext<NewPrivateNetworkForm>();

  const { data: projectRegions } = useProjectRegions(project.project_id);

  const has3AZ = useMemo(
    () => (projectRegions ? isRegionWith3AZ(projectRegions) : false),
    [projectRegions],
  );
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const onSelectRegion = (region: TLocalisation) => {
    unregister('region');

    if (region) {
      setValue('region', region.name, { shouldValidate: true });
      setValue('isLocalZone', region.isLocalZone, {
        shouldValidate: true,
      });
    }
  };

  const filterRegion = useCallback(
    (region: TLocalisation) => {
      const regionType = selectedRegionGroup
        ? selectedRegionGroup.name
        : region.type;

      return (
        region.isMacro ||
        (region.type === regionType && isNetworkUp(region.services))
      );
    },
    [selectedRegionGroup, isNetworkUp],
  );

  return (
    <div className="flex flex-col gap-6 my-8">
      <FeaturedDeploymentTilesInput
        value={selectedRegionGroup}
        onChange={setSelectedRegionGroup}
        name="deployment-app"
      />
      <Subtitle>{t('pci_project_network_private_localisation')}</Subtitle>
      <PCICommonContext.Provider value={pciCommonProperties}>
        <RegionSelector
          projectId={project.project_id}
          onSelectRegion={onSelectRegion}
          regionFilter={filterRegion}
        />
      </PCICommonContext.Provider>
    </div>
  );
};

export default LocalisationConfig;
