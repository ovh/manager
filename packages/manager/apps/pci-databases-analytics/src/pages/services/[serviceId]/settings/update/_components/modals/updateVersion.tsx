import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import VersionSelector from '@/components/Order/engine/engine-tile-version';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { ModalController } from '@/hooks/useModale';
import { createTree } from '@/lib/availabilitiesHelper';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { Engine } from '@/models/order-funnel';
import { useServiceData } from '@/pages/services/[serviceId]/layout';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateService } from '@/hooks/api/services.api.hooks';
import { useToast } from '@/components/ui/use-toast';

interface UpdateVersionProps {
  controller: ModalController;
  suggestions: database.Suggestion[];
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdateVersion = ({
  controller,
  suggestions,
  availabilities,
  capabilities,
  catalog,
  onSuccess,
  onError,
}: UpdateVersionProps) => {
  const { service, projectId } = useServiceData();
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { updateService, isPending } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: t('updateVersionToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (updatedService) => {
      toast.toast({
        title: t('updateVersionToastSuccessTitle'),
        description: t('updateVersionToastSuccessDescription', {
          newVersion: updatedService.version,
        }),
      });
      if (onSuccess) {
        onSuccess(updatedService);
      }
    },
  });
  const listVersions = useMemo(
    () =>
      createTree(availabilities, capabilities, suggestions, catalog)
        .map((e) => {
          // order the versions in the engines
          e.versions.sort((a, b) => a.order - b.order);
          return e;
        })
        ?.find((e: Engine) => e.name === service.engine)?.versions || [],
    [availabilities, capabilities, service],
  );
  const schema = z.object({
    version: z
      .string()
      .min(1)
      .refine((newVersion) => newVersion !== service.version, {
        message: t('updateVersionErrorSimilar'),
      }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      version: service.version,
    },
  });
  const onSubmit = form.handleSubmit((formValues) => {
    updateService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        version: formValues.version,
      },
    });
  });
  return (
    <Dialog {...controller}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle data-testid="update-version-modal">
                {t('updateVersionTitle')}
              </DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('updateVersionInputLabel')}</FormLabel>
                  <FormControl>
                    <VersionSelector
                      isEngineSelected
                      versions={listVersions}
                      selectedVersion={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end mt-2">
              <DialogClose asChild>
                <Button
                  data-testid="update-version-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('updateVersionCancelButton')}
                </Button>
              </DialogClose>
              <Button
                data-testid="update-version-submit-button"
                disabled={isPending}
              >
                {t('updateVersionSubmitButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateVersion;
