import { useParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import {
  useAddIntegration,
  useGetCapabilitiesIntegrations,
} from '@/hooks/api/integrations.api.hook';
import { useGetServices } from '@/hooks/api/services.api.hooks';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';

interface AddIntegrationModalProps {
  service: database.Service;
  controller: ModalController;
  onSuccess?: (integration: database.service.Integration) => void;
  onError?: (error: Error) => void;
}

const AddIntegration = ({
  service,
  controller,
  onError,
  onSuccess,
}: AddIntegrationModalProps) => {
  const { projectId } = useParams();
  const integrationsCapabilitiesQuery = useGetCapabilitiesIntegrations(
    projectId,
    service.engine,
    service.id,
  );
  const servicesQuery = useGetServices(projectId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/integrations',
  );
  const toast = useToast();
  const { addIntegration, isPending } = useAddIntegration({
    onError: (err) => {
      toast.toast({
        title: t('addIntegrationToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (addedIntegration) => {
      toast.toast({
        title: t('addIntegrationToastSuccessTitle'),
        description: t('addIntegrationToastSuccessDescription', {
          name: addedIntegration.type,
        }),
      });
      if (onSuccess) {
        onSuccess(addedIntegration);
      }
    },
  });
  // define the schema for the form
  const schema = z.object({
    type: z.nativeEnum(database.service.integration.TypeEnum),
    sourceServiceId: z.string(),
    destinationServiceId: z.string(),
    parameters: z.record(z.string()).optional(),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = form.handleSubmit((formValues) => {
    addIntegration({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      integration: {
        type: formValues.type,
        destinationServiceId: formValues.destinationServiceId,
        sourceServiceId: formValues.sourceServiceId,
        parameters: formValues.parameters,
      },
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addIntegrationTitle')}</DialogTitle>
          <DialogDescription>
            {t('addIntegrationDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addIntegrationInputTypeLabel')}</FormLabel>
                  {integrationsCapabilitiesQuery.isSuccess && (
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[200px] justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? integrationsCapabilitiesQuery.data.find(
                                    (integrationType) =>
                                      integrationType.type === field.value,
                                  )?.type
                                : 'Select an integration type'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search integration type..." />
                            <CommandEmpty>
                              No integration type found.
                            </CommandEmpty>
                            <CommandGroup>
                              {integrationsCapabilitiesQuery.data.map(
                                (integrationType) => (
                                  <CommandItem
                                    value={integrationType.type}
                                    key={integrationType.type}
                                    onSelect={() => {
                                      form.setValue(
                                        'type',
                                        integrationType.type,
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        integrationType.type === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {integrationType.type}
                                  </CommandItem>
                                ),
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {t('addIntegrationButtonAdd')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIntegration;
