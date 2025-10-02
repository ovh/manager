import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Text,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FlavorHelper from './flavor/FlavorHelper.component';
import FlavorCategorySelector from './flavor/FlavorCategorySelector.component';
import FlavorTypeSelector from './flavor/FlavorTypeSelector.component';

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <article className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('pci_instance_creation_select_flavor_title')}
        </Text>
        <FlavorHelper />
      </article>
      <article className="flex justify-between mt-6">
        <div className="flex gap-x-4">
          <FlavorCategorySelector />
          <FlavorTypeSelector />
        </div>
        <Checkbox className="self-end">
          <CheckboxControl />
          <CheckboxLabel>
            {t(
              'pci_instance_creation_select_flavor_inlcude_unavailable_action',
            )}
          </CheckboxLabel>
        </Checkbox>
      </article>
    </section>
  );
};

export default FlavorBlock;
