import { useTranslation } from 'react-i18next';
import { Button, Text } from '@ovhcloud/ods-react';
import { DeploymentModeSelection } from '@/pages/instances/create/components/LocalSelection/DeploymentModeSelection';

export const LocalSelection = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <hr className={'h-px my-8 bg-gray-200 border-0 w-full'} />
      <div className={'flex divide-x-4 divide-blue-700'}>
        <Text preset="heading-2">
          {t('pci_instance_creation_select_location_title')}
        </Text>
        <div>
          <Button variant={'ghost'} size={'sm'}>
            {t('pci_instance_creation_select_location_help')}
          </Button>
        </div>
      </div>
      <Text preset="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. enim ad. (Not
        mandatory) Si besoin d’un texte explicatif/consigne de section...
      </Text>
      <DeploymentModeSelection />
    </section>
  );
};
