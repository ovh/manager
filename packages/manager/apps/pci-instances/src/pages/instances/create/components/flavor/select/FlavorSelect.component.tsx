import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectCustomItemRendererArg,
  SelectCustomOptionRendererArg,
  SelectItem,
} from '@ovhcloud/ods-react';
import { TFlavorTag } from '@/types/instance/common.type';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { TOptionsData } from '../../../view-models/categoriesTypesViewModel';
import FlavorOption from './FlavorSelectOption.component';
import { useTranslation } from 'react-i18next';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { TInstanceCreationForm } from '../../../CreateInstance.schema';

type TFlavorSelectOption = {
  option: 'category' | 'type';
  items: TOptionsData[];
};

type TCustomSelectItemData = {
  tag: TFlavorTag;
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
        <FormField className="w-auto min-w-[236px] max-w-[50%]">
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
              customItemRenderer={({
                selectedItems,
              }: SelectCustomItemRendererArg) => (
                <>
                  {selectedItems[0] && (
                    <FlavorOption
                      label={selectedItems[0].label}
                      tag={
                        (selectedItems[0]
                          .customRendererData as TCustomSelectItemData).tag
                      }
                    />
                  )}
                </>
              )}
            />
            <SelectContent
              className="[&>div>span:first-child]:w-full"
              customOptionRenderer={({
                customData,
                label,
              }: SelectCustomOptionRendererArg) => (
                <FlavorOption
                  label={label}
                  tag={(customData as TCustomSelectItemData).tag}
                />
              )}
            />
          </Select>
        </FormField>
      )}
    />
  );
};

export default FlavorSelect;
