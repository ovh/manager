import { useTranslation } from 'react-i18next';
import { Divider, Text } from '@ovhcloud/ods-react';

export const Localization = () => {
  const { t } = useTranslation(['common', 'creation']);

  return (
    <section>
      <Divider />
      <div className="mt-8 flex flex-col gap-4">
        <Text preset="heading-2">
          {t('creation:pci_instance_creation_select_localization_label')}
        </Text>
        <Text preset="paragraph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. enim ad. (Not
          mandatory) Si besoin d’un texte explicatif/consigne de section...
        </Text>
      </div>
    </section>
  );
};
