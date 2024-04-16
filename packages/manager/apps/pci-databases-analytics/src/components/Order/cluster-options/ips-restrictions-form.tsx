import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { database } from '@/models/database';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface IpsRestrictionsFormProps {
  value: database.IpRestrictionCreation[];
  onChange: (newIps: database.IpRestrictionCreation[]) => void;
  disabled?: boolean;
}

const formatIpMask = (ipBlock: string) => {
  const [ip, mask] = ipBlock.split('/');
  return `${ip}/${mask || '32'}`;
};

const IpsRestrictionsForm = React.forwardRef<
  HTMLInputElement,
  IpsRestrictionsFormProps
>(({ value, onChange, disabled }, ref) => {
  const { t } = useTranslation(
    'pci-databases-analytics/components/order-options',
  );
  const ipSchema = z.object({
    ip: z
      .string()
      .regex(/^(?:\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/, {
        message: t('invalidIpError'),
      })
      .refine(
        (newIp) =>
          !value.some((existingIp) => existingIp.ip === formatIpMask(newIp)),
        {
          message: t('existingIpError'),
        },
      ),
    description: z.string().max(255),
  });

  const form = useForm({
    resolver: zodResolver(ipSchema),
  });

  const onSubmit: SubmitHandler<database.IpRestrictionCreation> = (
    data: database.IpRestrictionCreation,
  ) => {
    const formattedIp = {
      ...data,
      ip: formatIpMask(data.ip),
    };
    const newIps = [...value, formattedIp];
    onChange(newIps);
    form.reset();
  };

  const removeIp = (indexToRemove: number) => {
    const newIps = value.filter((_, index) => index !== indexToRemove);
    onChange(newIps);
  };

  return (
    <Form {...form}>
      <div className="flex w-full items-start gap-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <FormField
            control={form.control}
            name="ip"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ipFieldLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder="0.0.0.0/32" {...field} ref={ref} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ipDescriptionFieldLabel')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          variant={'ghost'}
          onClick={form.handleSubmit(onSubmit)}
          disabled={disabled}
          className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
        >
          <PlusCircle />
        </Button>
      </div>
      <ul>
        {value.map((ip, index) => (
          <li key={ip.ip} className="flex items-center">
            <Button
              className="text-red-500 rounded-full p-2 ml-2 hover:text-red-500 h-8 w-8"
              variant={'ghost'}
              type="button"
              onClick={() => removeIp(index)}
              disabled={disabled}
            >
              <MinusCircle />
            </Button>
            {ip.ip} {ip.description && <span>- {ip.description}</span>}
          </li>
        ))}
      </ul>
      <p>
        {t('numberOfConfiguredIps', {
          count: value.length,
          context: `${value.length}`,
        })}
      </p>
    </Form>
  );
});

IpsRestrictionsForm.displayName = 'IpsRestrictionsForm';

export default IpsRestrictionsForm;
