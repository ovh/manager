import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Plus, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@datatr-ux/uxlib';
import { useQuery } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';

interface IpsRestrictionsFormProps {
  value: database.IpRestrictionCreation[];
  onChange: (newIps: database.IpRestrictionCreation[]) => void;
  disabled?: boolean;
}

const formatIpMask = (ipBlock: string) => {
  const [ip, mask] = ipBlock.split('/');
  return `${ip}/${mask || '32'}`;
};

const dataplatformIp = '51.210.213.114';

const IpsRestrictionsForm2 = React.forwardRef<
  HTMLInputElement,
  IpsRestrictionsFormProps
>(({ value, onChange, disabled }, ref) => {
  const ipQuery = useQuery({
    queryKey: ['ip'],
    queryFn: async () => {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data as { ip: string };
    },
  });
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
    defaultValues: {
      ip: '',
      description: '',
    },
  });

  const addIp = ({ ip, description }: { ip: string; description: string }) => {
    const formattedIp = {
      ip: formatIpMask(ip),
      description,
    };
    const newIps = [...value, formattedIp];
    onChange(newIps);
    form.reset();
  };

  const onSubmit = form.handleSubmit((formValues) => {
    addIp(formValues);
  });

  const removeIp = (indexToRemove: number) => {
    const newIps = value.filter((_, index) => index !== indexToRemove);
    onChange(newIps);
  };

  return (
    <>
      {(!value.find((v) => v.ip === formatIpMask(dataplatformIp)) ||
        !value.find((v) => v.ip === formatIpMask(ipQuery.data?.ip))) && (
        <div>
          <Label className="mb-2">Adresses IP communes</Label>
          <div className="flex gap-2">
            {!value.find((v) => v.ip === formatIpMask(dataplatformIp)) && (
              <Button
                className="px-2"
                mode={'outline'}
                size={'s'}
                onClick={() =>
                  addIp({
                    ip: dataplatformIp,
                    description: 'OVHcloud Dataplatform',
                  })
                }
              >
                <Plus className="size-4 mr-2" />
                OVHcloud Dataplatform IP
              </Button>
            )}

            {!value.find((v) => v.ip === formatIpMask(ipQuery.data?.ip)) && (
              <Button
                className="px-2"
                mode={'outline'}
                size={'s'}
                onClick={() =>
                  addIp({ ip: ipQuery.data?.ip, description: 'user ip' })
                }
              >
                <Plus className="size-4 mr-2" />
                Current IP
              </Button>
            )}
          </div>
        </div>
      )}
      <div>
        <Form {...form}>
          <form
            id="ip-form"
            onSubmit={onSubmit}
            className="grid md:flex md:flex-row md:items-start gap-2"
          >
            <FormField
              control={form.control}
              name="ip"
              defaultValue=""
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem
                  data-testid="ip-description-field-label"
                  className="w-full"
                >
                  <FormLabel>{t('ipDescriptionFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="ip-description-input-field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              data-testid="ip-add-button"
              className="md:mt-8"
              mode={'outline'}
              disabled={disabled}
              type="submit"
              form="ip-form"
            >
              <Plus className="mr-2 size-4" />
              Add ip
            </Button>
          </form>
        </Form>
      </div>
      {value.length > 0 && (
        <Table className="table-fixed mt-2">
          <TableHeader className="border bg-[#f7f8f8]">
            <TableRow>
              <TableHead className="h-10 px-2 border font-semibold text-primary-800">
                IP
              </TableHead>
              <TableHead className="h-10 px-2 border font-semibold text-primary-800 border-r-0">
                Description
              </TableHead>
              <TableHead className="h-10 px-2 border font-semibold text-primary-800 border-l-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map(({ ip, description }, idx) => (
              <TableRow key={`${ip}-${idx}`} className="!border">
                <TableCell>{ip}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    data-testid={`ip-remove-button-${idx}`}
                    className="text-red-500 rounded-full p-2 hover:text-red-500 size-8"
                    mode={'ghost'}
                    variant={'destructive'}
                    type="button"
                    onClick={() => removeIp(idx)}
                    disabled={disabled}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p data-testid="configured-ips" className="mt-2">
        {t('numberOfConfiguredIps', {
          count: value.length,
          context: `${value.length}`,
        })}
      </p>
    </>
  );
});

IpsRestrictionsForm2.displayName = 'IpsRestrictionsForm2';

export default IpsRestrictionsForm2;
