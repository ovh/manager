import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';

export const Localization = () => {
  const { t } = useTranslation(['common', 'creation']);

  return (
    <section>
      <div className="mt-8 flex flex-col gap-4">
        <Text preset="heading-2">
          {t('creation:pci_instance_creation_select_localization_label')}
        </Text>
      </div>
    </section>
  );
};
