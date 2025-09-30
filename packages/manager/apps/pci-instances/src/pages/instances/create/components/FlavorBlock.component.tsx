import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Divider,
  Text,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FlavorCategoryTypeSelect from './flavor/select/FlavorSelect.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  selectCategories,
  selectTypes,
} from '../view-models/categoriesTypesViewModel';
import { deps } from '@/deps/deps';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.page';
import { FlavorHelper } from './flavor/FlavorHelper.component';
import { FlavorSelection } from '@/pages/instances/create/components/flavor/FlavorSelection.component';

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');
  const projectId = useProjectId();
  const { control } = useFormContext<TInstanceCreationForm>();
  const flavorCategory = useWatch({ control, name: 'flavorCategory' });

  const categories = selectCategories(deps)(projectId);
  const types = selectTypes(deps)(projectId, flavorCategory);

  return (
    <section>
      <Divider spacing="64" />
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
          {categories.length && (
            <FlavorCategoryTypeSelect items={categories} option="category" />
          )}
          {types.length && (
            <FlavorCategoryTypeSelect items={types} option="type" />
          )}
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
      <FlavorSelection />
    </section>
  );
};

export default FlavorBlock;
