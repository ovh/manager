import React from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { Input } from '@/components/ui/input';
import { Flavor } from '@/types/orderFunnel';

interface UpdateFlavorFormProps {
  listFlavor: Flavor[];
  currentFlavor: string;
  currentQuantity: number;
  onChange: (newFlavor: string, newQuantity: number) => void;
}

const UpdateFlavorForm = React.forwardRef<
  HTMLInputElement,
  UpdateFlavorFormProps
>(({ listFlavor, currentFlavor, currentQuantity, onChange }, ref) => {
  const { t } = useTranslation('components/flavor');
  const schema = z.object({
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.coerce.number(),
    }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    flavorWithQuantity: {
      flavor: currentFlavor,
      quantity: currentQuantity,
    },
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleChange = async () => {
    onChange(
      form.getValues('flavorWithQuantity.flavor'),
      form.getValues('flavorWithQuantity.quantity'),
    );
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="flavorWithQuantity.flavor"
        render={({ field }) => (
          <FormItem className="max-w-sm sm:max-w-full">
            <FormControl>
              <FlavorsSelect
                ref={ref}
                {...field}
                isUpdate={true}
                flavors={listFlavor}
                value={field.value}
                resourcesQuantity={form.getValues(
                  'flavorWithQuantity.quantity',
                )}
                onChange={(newFlavor) => {
                  form.setValue('flavorWithQuantity.flavor', newFlavor);
                  form.setValue('flavorWithQuantity.quantity', 1);
                  handleChange();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        defaultValue={1}
        name="flavorWithQuantity.quantity"
        render={({ field }) => (
          <FormItem>
            <p className="mt-4 text-sm">
              {t('fieldFlavorQuantityDescription')}
            </p>
            <FormControl className="px-2">
              <Input
                ref={ref}
                type="number"
                max={
                  listFlavor.find(
                    (flav) =>
                      flav.id === form.getValues('flavorWithQuantity.flavor'),
                  )?.max
                }
                min={1}
                value={field.value}
                {...field}
                onChange={(e) => {
                  form.setValue(
                    'flavorWithQuantity.quantity',
                    Number(e.target.value),
                    {
                      shouldValidate: true,
                    },
                  );
                  handleChange();
                }}
              />
            </FormControl>
            <div className="flex flex-row justify-between">
              <FormMessage />
              {form.getValues('flavorWithQuantity.quantity') > 1 && (
                <div className="inline-block text-xs">
                  <span>{t('fieldFlavorQuantityInformation')}</span>{' '}
                  <span className="capitalize font-bold">
                    {form.getValues('flavorWithQuantity.flavor')}
                  </span>
                  {': '}
                  <span>
                    {
                      listFlavor.find(
                        (flav) =>
                          flav.id ===
                          form.getValues('flavorWithQuantity.flavor'),
                      )?.max
                    }
                  </span>
                </div>
              )}
            </div>
          </FormItem>
        )}
      />
    </Form>
  );
});

export default UpdateFlavorForm;
