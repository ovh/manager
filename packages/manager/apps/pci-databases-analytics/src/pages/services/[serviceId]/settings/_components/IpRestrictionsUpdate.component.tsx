import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

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
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('ipsUpdateErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
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
    editService({
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
                  disabled={
                    service.capabilities.ipRestrictions?.update !==
                    database.service.capability.StateEnum.enabled
                  }
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
              data-testid="ips-update-cancel-button"
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => form.reset()}
            >
              {t('ipsUpdateCancelButton')}
            </Button>
            <Button
              data-testid="ips-update-submit-button"
              disabled={
                isPending ||
                service.capabilities.ipRestrictions?.update ===
                  database.service.capability.StateEnum.disabled
              }
            >
              {t('ipsUpdateSubmitButton')}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default IpsRestrictionsUpdate;
