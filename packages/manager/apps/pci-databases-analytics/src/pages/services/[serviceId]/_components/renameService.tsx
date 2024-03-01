import { useParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { database } from '@/models/database';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateService } from '@/hooks/api/services.api.hooks';

interface UpdateServiceNameModalProps {
  service: database.Service;
  controller: ModalController;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const RenameService = ({
  service,
  controller,
  onError,
  onSuccess,
}: UpdateServiceNameModalProps) => {
  // import translations
  const { projectId } = useParams();
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const toast = useToast();
  const { updateService, isPending } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: t('renameServiceToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (renamedService) => {
      toast.toast({
        title: t('renameServiceToastSuccessTitle'),
        description: t('renameServiceToastSuccessDescription', {
          newName: renamedService.description,
        }),
      });
      if (onSuccess) {
        onSuccess(renamedService);
      }
    },
  });
  // define the schema for the form
  const schema = z.object({
    description: z
      .string()
      .min(3, {
        message: t('renameServiceErrorMinLength', { min: 3 }),
      })
      .max(30, {
        message: t('renameServiceErrorMaxLength', { max: 30 }),
      }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
    },
  });
  // fill form with service values
  useEffect(() => {
    if (!service) return;
    form.setValue('description', service.description);
  }, [service, form]);

  const onSubmit = form.handleSubmit((formValues) => {
    updateService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        description: formValues.description,
      },
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('renameServiceTitle')}</DialogTitle>
          <DialogDescription>{t('renameServiceDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renameServiceNameInputLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {t('renameServiceNameSubmit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameService;
