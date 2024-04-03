import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import IpsRestrictionsForm from '@/components/Order/cluster-options/ips-restrictions-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateService } from '@/hooks/api/services.api.hooks';
import { database } from '@/models/database';
import { useServiceData } from '../../layout';

interface IpsRestrictionsUpdateProps {
  initialValue: database.service.IpRestriction[];
}
const IpsRestrictionsUpdate = ({
  initialValue,
}: IpsRestrictionsUpdateProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const { projectId, service, serviceQuery } = useServiceData();
  const toast = useToast();
  const schema = z.object({
    ipRestrictions: z.array(
      z.object({
        ip: z.string(),
        description: z.string(),
      }),
    ),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ipRestrictions: initialValue,
    },
  });
  const { updateService, isPending } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: t('ipsUpdateErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onSuccess: (updatedService) => {
      toast.toast({
        title: t('ipsUpdateSuccessTitle'),
        description: t('ipsUpdateSuccessDescription'),
      });
      serviceQuery.refetch();
      form.reset({
        ipRestrictions: updatedService.ipRestrictions,
      });
    },
  });
  const onSubmit = form.handleSubmit((formValues) => {
    updateService({
      serviceId: service.id,
      engine: service.engine,
      projectId,
      data: {
        ipRestrictions: formValues.ipRestrictions as database.IpRestrictionCreation[],
      },
    });
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="ipRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <IpsRestrictionsForm
                  {...field}
                  value={field.value as database.IpRestrictionCreation[]}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.isDirty && (
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => form.reset()}
            >
              {t('ipsUpdateCancelButton')}
            </Button>
            <Button disabled={isPending}>{t('ipsUpdateSubmitButton')}</Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default IpsRestrictionsUpdate;
