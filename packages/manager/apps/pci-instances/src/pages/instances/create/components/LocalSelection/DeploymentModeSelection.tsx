import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';

export const DeploymentModeSelection = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <hr className={'h-px my-8 bg-gray-200 border-0 w-full'} />
      <Text preset="heading-3">
        {t('pci_instance_creation_select_deployment_mode_title')}
      </Text>
      <Text preset="paragraph">
        (Not mandatory) Si besoin d’un texte explicatif/consigne...
      </Text>
    </section>
  );
};
