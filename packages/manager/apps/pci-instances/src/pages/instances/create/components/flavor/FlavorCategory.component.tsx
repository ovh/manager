import { mockedFlavorCategories } from '@/__mocks__/instance/constants';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
} from '@ovhcloud/ods-react';
import { FC, useMemo } from 'react';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TInstanceCreationForm } from '../../CreateInstance.page';

const FlavorCategory: FC = () => {
  const { t } = useTranslation('creation');
  const { trackClick } = useOvhTracking();
  const { control, setValue } = useFormContext<TInstanceCreationForm>();

  // TODO: replace with select view models
  const items: SelectItem[] = useMemo(
    () =>
      mockedFlavorCategories.map(({ name }) => ({ label: name, value: name })),
    [],
  );

  const handleSelect = (
    field: ControllerRenderProps<TInstanceCreationForm, 'flavorCategory'>,
    category?: string,
  ) => {
    if (!category) return;

    field.onChange(category);

    // TODO: will be replaced by select
    const flavorType =
      mockedFlavorCategories.find(({ name }) => name === category)?.type[0]
        ?.name ?? '';
    setValue('flavorType', flavorType);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tab,
      actionType: 'action',
      actions: ['add_instance', 'select_flavor', category],
    });
  };

  return (
    <Controller
      control={control}
      name="flavorCategory"
      render={({ field }) => (
        <FormField className="min-w-[236px] w-auto max-w-[50%]">
          <FormFieldLabel>
            {t('pci_instance_creation_select_flavor_category_label')}
          </FormFieldLabel>
          <Select
            items={items}
            value={[field.value]}
            onValueChange={({ value }) => handleSelect(field, value[0])}
          >
            <SelectControl className="h-[2.5em]" />
            <SelectContent />
          </Select>
        </FormField>
      )}
    />
  );
};

export default FlavorCategory;
