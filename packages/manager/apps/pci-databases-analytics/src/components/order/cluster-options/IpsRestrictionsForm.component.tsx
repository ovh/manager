import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as database from '@/types/cloud/project/database';
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
      .regex(
        /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\/(3[0-2]|[1-2]?\d))?$/,
        {
          message: t('invalidIpError'),
        },
      )
      .refine(
        (newIp) =>
          !value.some((existingIp) => existingIp.ip === formatIpMask(newIp)),
        {
          message: t('existingIpError'),
        },
      ),
    description: z.string().max(50),
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
                <FormLabel data-testid="ip-field-label">
                  {t('ipFieldLabel')}
                </FormLabel>
                <FormControl>
                  <Input
                    data-testid="ip-input-field"
                    placeholder="0.0.0.0/32"
                    {...field}
                    ref={ref}
                  />
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
              <FormItem data-testid="ip-description-field-label">
                <FormLabel>{t('ipDescriptionFieldLabel')}</FormLabel>
                <FormControl>
                  <Input data-testid="ip-description-input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          data-testid="ip-add-button"
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
              data-testid={`ip-remove-button-${index}`}
              className="text-red-500 rounded-full p-2 ml-2 hover:text-red-500 h-8 w-8"
              variant={'ghost'}
              type="button"
              onClick={() => removeIp(index)}
              disabled={disabled}
            >
              <MinusCircle />
            </Button>
            <div>
              <span>{ip.ip}</span>
              {ip.description && (
                <>
                  <span> - </span>
                  <span className="truncate max-w-96" title={ip.description}>
                    {ip.description}
                  </span>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p data-testid="configured-ips">
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
