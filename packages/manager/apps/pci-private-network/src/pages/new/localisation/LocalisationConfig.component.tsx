import { Subtitle } from '@ovh-ux/manager-react-components';
import { RegionSelector, useProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const LocalisationConfig: React.FC = () => {
  const { t } = useTranslation('new');
  const { data: project } = useProject();
  const { setValue } = useFormContext<NewPrivateNetworkForm>();

  return (
    <div className="flex flex-col gap-6 my-8">
      <Subtitle>{t('pci_project_network_private_localisation')}</Subtitle>
      <RegionSelector
        projectId={project.project_id}
        onSelectRegion={(region) => {
          // region isMacro
          if (region) {
            setValue('region', region.name, { shouldValidate: true });
            setValue('isLocalZone', region.isLocalZone);
          }
        }}
        regionFilter={(region) =>
          region.isMacro ||
          region.services.some(
            (service) => service.name === 'network' && service.status === 'UP',
          )
        }
      />
    </div>
  );
};

export default LocalisationConfig;
