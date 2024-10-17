import { useParams } from 'react-router-dom';
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
import * as database from '@/types/cloud/project/database';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { useTrackAction, useTrackPage } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface RenameServiceProps {
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
}: RenameServiceProps) => {
  // import translations
  const { projectId } = useParams();
  useTrackPage(TRACKING.renameService.page(service.engine));
  const track = useTrackAction();
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const toast = useToast();
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('renameServiceToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onEditSuccess: (renamedService) => {
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
    track(TRACKING.renameService.confirm(service.engine));
    editService({
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
          <DialogTitle data-testid="rename-service-modal">
            {t('renameServiceTitle')}
          </DialogTitle>
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
                    <Input
                      data-testid="rename-service-input"
                      placeholder="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="rename-service-cancel-button"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    track(TRACKING.renameService.cancel(service.engine))
                  }
                >
                  {t('renameServiceButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="rename-service-submit-button"
                type="submit"
                disabled={isPending}
              >
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
