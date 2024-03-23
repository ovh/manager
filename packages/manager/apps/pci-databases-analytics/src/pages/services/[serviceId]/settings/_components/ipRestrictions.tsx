import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import IpsRestrictionsForm from '@/components/Order/cluster-options/ips-restrictions-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  const { projectId, service } = useServiceData();
  const toast = useToast();
  const { updateService, isPending } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: 'Une erreur est survenue lors de la mise à jour de vos ips',
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onSuccess: () => {
      toast.toast({
        title: 'Succès',
        description: 'La mise à jour de vos ips a été effectuée avec succès',
      });
    },
  });
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
              Annuler
            </Button>
            <Button disabled={isPending}>Sauvegarder les modifications</Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default IpsRestrictionsUpdate;
