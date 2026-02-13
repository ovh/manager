import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Alert,
  AlertTitle,
  DialogBody,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useAddIntegrationForm } from './useAddIntegrationForm.hook';
import { useAddIntegration } from '@/data/hooks/database/integration/useAddIntegration.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal.component';

const AddIntegration = () => {
  const { projectId } = useParams();
  const { service } = useServiceData();
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/integrations',
  );
  const model = useAddIntegrationForm();
  const toast = useToast();
  const { addIntegration, isPending } = useAddIntegration({
    onError: (err) => {
      toast.toast({
        title: t('addIntegrationToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (addedIntegration) => {
      toast.toast({
        title: t('addIntegrationToastSuccessTitle'),
        description: t('addIntegrationToastSuccessDescription', {
          name: addedIntegration.type,
        }),
      });
      navigate('../');
    },
  });

  const onSubmit = model.form.handleSubmit((formValues) => {
    const normalizedParameters =
      'parameters' in formValues && formValues.parameters
        ? Object.fromEntries(
            Object.entries(formValues.parameters).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : {};
    addIntegration({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      integration: {
        type: formValues.type,
        destinationServiceId: formValues.destinationServiceId,
        sourceServiceId: formValues.sourceServiceId,
        parameters: normalizedParameters,
      },
    });
  });

  const errors = useMemo(() => {
    const messages: string[] = [];
    const formErrors = model.form.formState.errors;
    const formError = formErrors['' as keyof typeof formErrors];
    if (formError?.message) {
      messages.push(formError.message.toString());
    }
    return messages;
  }, [model.form.formState.errors]);

  return (
    <RouteModal isLoading={!service}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="add-integrations-modal">
            {t('addIntegrationTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('addIntegrationDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {model.result.capability &&
            (model.lists.sources.length === 0 ||
              model.lists.destinations.length === 0) && (
              <Alert
                variant="warning"
                className="rounded-md flex flex-col gap-2"
              >
                <AlertTitle>
                  {t('addIntegrationNoServiceAlertTitle')}
                </AlertTitle>
                <div className="text-xs">
                  <p>{t('addIntegrationNoServiceAlertDescription')}</p>
                  <ul className="list-inside list-disc">
                    {[
                      ...new Set(
                        [
                          ...model.result.capability.sourceEngines,
                          ...model.result.capability.destinationEngines,
                        ].filter((e) => e !== service.engine),
                      ),
                    ].map((engine) => (
                      <li key={engine} className="list-item">
                        <span>{engine}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Alert>
            )}

          <Form {...model.form}>
            <form
              onSubmit={onSubmit}
              className="grid gap-4"
              id="add-integration-form"
            >
              <div>
                {errors.map((error, i) => (
                  <span
                    key={`${error}-${i}`}
                    className="text-sm font-medium text-destructive"
                  >
                    {error}
                  </span>
                ))}
              </div>
              <FormField
                control={model.form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addIntegrationInputTypeLabel')}</FormLabel>
                    {model.queries.capabilities.isSuccess && (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={model.lists.capabilities.length < 2}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-integration-trigger">
                            <SelectValue
                              data-testid="select-value"
                              placeholder={t(
                                'addIntegrationInputTypePlaceholder',
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent data-testid="select-content">
                          {model.lists.capabilities.map((c) => (
                            <SelectItem
                              data-testid="select-item"
                              value={c.type}
                              key={c.type}
                            >
                              <div className="flex flex-col items-start">
                                <span>{c.type}</span>
                                <span className="text-xs">
                                  {t(
                                    `integrationTypeDescription-${c.type}`,
                                    '',
                                  )}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={model.form.control}
                  name="sourceServiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('addIntegrationInputSourceLabel')}
                      </FormLabel>
                      {model.queries.services.isSuccess && (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={model.lists.sources.length < 2}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  'addIntegrationInputSourcePlaceholder',
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {model.lists.sources.map((source) => (
                              <SelectItem key={source.id} value={source.id}>
                                {source.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={model.form.control}
                  name="destinationServiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('addIntegrationInputDestinationLabel')}
                      </FormLabel>
                      {model.queries.services.isSuccess && (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={model.lists.destinations.length < 2}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  'addIntegrationInputDestinationPlaceholder',
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {model.lists.destinations.map((destination) => (
                              <SelectItem
                                key={destination.id}
                                value={destination.id}
                              >
                                {destination.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {model.result.capability?.parameters?.map((parameter) => (
                  <FormField
                    key={parameter.name}
                    control={model.form.control}
                    name={`parameters.${parameter.name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{parameter.name}</FormLabel>
                        <Input
                          data-testid={`parameter-${parameter.name}`}
                          {...field}
                          type={
                            parameter.type ===
                            database.capabilities.integration.parameter.TypeEnum
                              .integer
                              ? 'number'
                              : 'text'
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </form>
          </Form>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              mode="ghost"
              data-testid="add-database-cancel-button"
            >
              {t('addIntegrationButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            form="add-integration-form"
            data-testid="integration-submit-button"
            type="submit"
            disabled={isPending}
          >
            {t('addIntegrationButtonAdd')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddIntegration;
