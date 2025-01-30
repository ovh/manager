import { useMemo } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  RegionSelector,
  useProject,
  PCICommonContext,
  usePCICommonContextFactory,
  useProjectRegions,
  TRegion,
  TLocalisation,
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

  const { data: regions } = useProjectRegions(project.project_id);

  const has3AZ = useMemo(() => (regions ? isRegionWith3AZ(regions) : false), [
    regions,
  ]);
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const onSelectRegion = (region: TLocalisation) => {
    unregister('region');

    if (region) {
      setValue('region', region.name, { shouldValidate: true });
      setValue('isLocalZone', region.isLocalZone, {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 my-8">
      <Subtitle>{t('pci_project_network_private_localisation')}</Subtitle>
      <PCICommonContext.Provider value={pciCommonProperties}>
        <RegionSelector
          projectId={project.project_id}
          onSelectRegion={onSelectRegion}
          regionFilter={(region) =>
            region.isMacro || isNetworkUp(region.services)
          }
        />
      </PCICommonContext.Provider>
    </div>
  );
};

export default LocalisationConfig;
