import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
  SelectOptionItem,
} from '@ovhcloud/ods-react';
import { TFlavorTag } from '@/types/instance/common.type';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { TInstanceCreationForm } from '../../../CreateInstance.page';
import { useEffect, useMemo } from 'react';
import { TOptionsData } from '../../../view-models/categoriesTypesViewModel';
import FlavorOption from './FlavorSelectOption.component';
import { useTranslation } from 'react-i18next';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

type TFlavorSelectOption = {
  option: 'category' | 'type';
  items: TOptionsData[];
};

const FlavorSelect = ({ option, items }: TFlavorSelectOption) => {
  const { t } = useTranslation('common');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const { trackClick } = useOvhTracking();
  const flavorType = useWatch({ control, name: 'flavorType' });

  const isType = option === 'type';
  const flavorField = isType ? 'flavorType' : 'flavorCategory';

  const options: SelectItem<{ tag: string | null }>[] = useMemo(() => {
    return items.map((item) => ({
      label: item.name,
      value: item.value,
      customRendererData: {
        tag: item.tags?.[0] ?? null,
      },
    }));
  }, [items]);

  const handleSelect = (
    field: ControllerRenderProps<
      TInstanceCreationForm,
      'flavorCategory' | 'flavorType'
    >,
    value: string | null,
  ) => {
    field.onChange(value);

    if (isType)
      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.tab,
        actionType: 'action',
        actions: ['add_instance', 'select_flavor', option],
      });
  };

  useEffect(() => {
    if (isType) {
      const availablePreviousSelectedType = items.find(
        (type) => type.value === flavorType,
      );

      if (!availablePreviousSelectedType && items[0]?.value) {
        setValue('flavorType', items[0].value);
      }
    }
  }, [flavorType, isType, items, option, setValue]);

  return (
    <Controller
      control={control}
      name={flavorField}
      render={({ field }) => (
        <FormField className="min-w-[236px] w-auto max-w-[50%]">
          <FormFieldLabel>
            {t(`pci_instances_common_instance_${isType ? 'type' : 'category'}`)}
          </FormFieldLabel>
          <Select
            items={options}
            value={field.value ? [field.value] : []}
            onValueChange={({ value }) => handleSelect(field, value[0] ?? null)}
          >
            <SelectControl
              className="h-[2.5em]"
              customItemRenderer={({ selectedItems }) => {
                const item = selectedItems[0] as SelectOptionItem<{
                  tag: TFlavorTag;
                }>;

                return (
                  <FlavorOption
                    label={item.label}
                    tag={item.customRendererData?.tag}
                  />
                );
              }}
            />
            <SelectContent
              className="[&>div>span:first-child]:w-full"
              customOptionRenderer={({ customData, label }) => {
                const tag = (customData as { tag: TFlavorTag }).tag;

                return <FlavorOption label={label} tag={tag} />;
              }}
            />
          </Select>
        </FormField>
      )}
    />
  );
};

export default FlavorSelect;
