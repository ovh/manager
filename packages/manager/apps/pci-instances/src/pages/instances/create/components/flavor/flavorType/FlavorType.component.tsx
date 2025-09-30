import { mockedFlavorCategories } from '@/__mocks__/instance/constants';
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
import { FC, useMemo } from 'react';
import FlavorTypeItem from './FlavorTypeItem.component';
import { TFlavorTypeTag } from '@/types/instance/common.type';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../../CreateInstance.page';

const FlavorType: FC = () => {
  const { control } = useFormContext<TInstanceCreationForm>();
  const flavorCategory = useWatch({
    control,
    name: 'flavorCategory',
  });

  // TODO: move to select view-model
  const items: SelectItem<{ tag: string | null }>[] = useMemo(() => {
    return (
      mockedFlavorCategories
        .find(({ name }) => name === flavorCategory)
        ?.type.map((item) => ({
          label: item.name,
          value: item.name,
          customRendererData: {
            tag: item.tags[0] ?? null,
          },
        })) ?? []
    );
  }, [flavorCategory]);

  return (
    <Controller
      control={control}
      name="flavorType"
      render={({ field }) => (
        <FormField className="min-w-[236px] w-auto max-w-[50%]">
          <FormFieldLabel>Type de XXXXXXXX</FormFieldLabel>
          <Select
            items={items}
            value={[field.value]}
            onValueChange={({ value }) => field.onChange(value[0])}
          >
            <SelectControl
              className="h-[2.5em]"
              customItemRenderer={({
                selectedItems,
              }: SelectCustomItemRendererArg<{ tag: TFlavorTypeTag }>) => (
                <>
                  {selectedItems[0] && (
                    <FlavorTypeItem
                      label={selectedItems[0].label}
                      tag={selectedItems[0].customRendererData?.tag}
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
              }: SelectCustomOptionRendererArg<{ tag: TFlavorTypeTag }>) => (
                <FlavorTypeItem label={label} tag={customData?.tag} />
              )}
            />
          </Select>
        </FormField>
      )}
    />
  );
};

export default FlavorType;
