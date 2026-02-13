import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';

export const FlexFlavorHelper: FC = () => {
  const { t } = useTranslation(['creation']);

  return (
    <HelpDrawer>
      <Text preset="heading-2">
        {t('creation:pci_instance_creation_flex_flavor.title')}
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans
          t={t}
          i18nKey="creation:pci_instance_creation_flex_flavor.disk_capacity"
          components={{
            span: <span className="font-semibold" />,
          }}
        />
      </Text>
      <Text preset="paragraph" className="py-4">
        {t('creation:pci_instance_creation_flex_flavor.resizing_explanation')}
      </Text>
    </HelpDrawer>
  );
};
