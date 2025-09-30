import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Text,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FlavorHelper from './flavor/FlavorHelper.component';
import FlavorCategory from './flavor/FlavorCategory.component';
import FlavorType from './flavor/flavorType/FlavorType.component';

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('pci_instance_creation_select_flavor_title')}
        </Text>
        <FlavorHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. enim ad. (Not
        mandatory) Si besoin d’un texte explicatif/consigne de section...
      </Text>
      <div className="flex justify-between mt-6 flex-wrap">
        <div className="flex gap-x-4 gap-y-6">
          <FlavorCategory />
          <FlavorType />
        </div>
        <Checkbox className="self-end">
          <CheckboxControl />
          <CheckboxLabel className="text-[var(--ods-color-text)]">
            {t(
              'pci_instance_creation_select_flavor_include_unavailable_action',
            )}
          </CheckboxLabel>
        </Checkbox>
      </div>
    </section>
  );
};

export default FlavorBlock;
