import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { P } from '@/components/typography';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

import { ModalController } from '@/hooks/useModale';
import { useNamespaceForm } from './formNamespace/formNamespace.hook';
import {
  MutateNamespaceProps,
  useAddNamespace,
  useEditNamespace,
} from '@/hooks/api/namespaces.api.hooks';

import { database } from '@/models/database';
import { NamespaceEdition } from '@/api/databases/namespaces';
import {
  durationStringToDuration,
  durationToISODurationString,
} from '@/lib/durationHelper';
import { TOAST } from '@/configuration/toast';

interface AddEditNamespaceModalProps {
  isEdition: boolean;
  editedNamespace?: database.m3db.Namespace;
  namespaces: database.m3db.Namespace[];
  service: database.Service;
  controller: ModalController;
  onSuccess?: (namespace?: database.m3db.Namespace) => void;
  onError?: (error: Error) => void;
}
const AddEditNamespace = ({
  isEdition,
  editedNamespace,
  namespaces,
  service,
  controller,
  onSuccess,
  onError,
}: AddEditNamespaceModalProps) => {
  const [advancedConfiguration, setAdvancedConfiguration] = useState(false);
  const showAdvancedConfig =
    isEdition &&
    (editedNamespace.snapshotEnabled ||
      editedNamespace.writesToCommitLogEnabled ||
      editedNamespace.retention.blockDataExpirationDuration ||
      editedNamespace.retention.blockSizeDuration ||
      editedNamespace.retention.bufferFutureDuration ||
      editedNamespace.retention.bufferPastDuration);

  const { projectId } = useParams();
  const { form } = useNamespaceForm({
    editedNamespace,
    existingNamespaces: namespaces,
  });

  useEffect(() => {
    if (!controller.open) form.reset();
  }, [controller.open]);

  useEffect(() => {
    if (!isEdition) return;
    if (showAdvancedConfig) setAdvancedConfiguration(true);
  }, [showAdvancedConfig]);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );
  const prefix = isEdition ? 'edit' : 'add';
  const toast = useToast();

  const NamespaceMutationProps: MutateNamespaceProps = {
    onError(err) {
      toast.toast({
        title: t(`${prefix}NamespaceToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.details.message,
        duration: TOAST.ERROR_DURATION,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess(ns) {
      form.reset();
      toast.toast({
        title: t('formNamespaceToastSuccessTitle'),
        description: t(`${prefix}NamespaceToastSuccessDescription`, {
          name: ns.name,
        }),
      });
      if (onSuccess) {
        onSuccess(ns);
      }
    },
  };

  const { addNamespace, isPending: isPendingAddNamespace } = useAddNamespace(
    NamespaceMutationProps,
  );

  const { editNamespace, isPending: isPendingEditNamespace } = useEditNamespace(
    NamespaceMutationProps,
  );

  const onSubmit = form.handleSubmit((formValues) => {
    const retentionFormValues: database.m3db.namespace.Retention = {
      periodDuration: durationToISODurationString(
        durationStringToDuration(formValues.periodDuration.toLocaleLowerCase()),
      ),
    };

    if (advancedConfiguration) {
      if (formValues.blockDataExpirationDuration)
        retentionFormValues.blockDataExpirationDuration = durationToISODurationString(
          durationStringToDuration(
            formValues.blockDataExpirationDuration.toLocaleLowerCase(),
          ),
        );

      if (!isEdition && formValues.blockSizeDuration)
        retentionFormValues.blockSizeDuration = durationToISODurationString(
          durationStringToDuration(
            formValues.blockSizeDuration.toLocaleLowerCase(),
          ),
        );

      if (formValues.bufferFutureDuration)
        retentionFormValues.bufferFutureDuration = durationToISODurationString(
          durationStringToDuration(
            formValues.bufferFutureDuration.toLocaleLowerCase(),
          ),
        );

      if (formValues.bufferPastDuration) {
        retentionFormValues.bufferPastDuration = durationToISODurationString(
          durationStringToDuration(
            formValues.bufferPastDuration.toLocaleLowerCase(),
          ),
        );
      }
    }

    if (isEdition) {
      if (Object.entries(form.formState.dirtyFields).length === 0) {
        onSuccess();
        return;
      }
      const namespace: NamespaceEdition = {
        retention: retentionFormValues,
        snapshotEnabled: formValues.snapshotEnabled,
        writesToCommitLogEnabled: formValues.writesToCommitLogEnabled,
      };

      if (formValues.resolution) {
        namespace.resolution = durationToISODurationString(
          durationStringToDuration(formValues.resolution),
        );
      }

      editNamespace({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        namespaceId: editedNamespace.id,
        namespace,
      });
    } else {
      const namespace: database.m3db.NamespaceCreation = {
        name: formValues.name,
        retention: retentionFormValues,
        resolution: durationToISODurationString(
          durationStringToDuration(formValues.resolution),
        ),
        type: formValues.type,
        snapshotEnabled: formValues.snapshotEnabled,
        writesToCommitLogEnabled: formValues.writesToCommitLogEnabled,
      };

      addNamespace({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        namespace,
      });
    }
  });

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t(`${prefix}NamespaceTitle`)}</DialogTitle>
          {!isEdition && (
            <DialogDescription>
              {t('addNamespaceDescription')}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            {/* NamespaceName */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formNamespaceFieldNameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      disabled={
                        isEdition ||
                        isPendingAddNamespace ||
                        isPendingEditNamespace
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Namespace type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center space-x-2">
                    <FormLabel>{t('formNamespaceFieldTypeLabel')}</FormLabel>
                    <FormControl>
                      <RadioGroup defaultValue={field.value}>
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={field.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t(`formNamespaceField${field.value}TypeLabel`)}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <P>{t('formNamespaceFieldTypeDescription')}</P>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Retention */}
            <FormField
              control={form.control}
              name="periodDuration"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2 mt-2">
                    <FormLabel>
                      {t('formNamespaceFieldPeriodDurationLabel')}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <P>
                          {t('formNamespaceFieldPeriodDurationDescription')}
                        </P>
                        <P>{t('formNamespaceFieldDurationDescription')}</P>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'formNamespaceFieldPeriodDurationPlaceholder',
                      )}
                      disabled={isPendingAddNamespace || isPendingEditNamespace}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Resolution */}
            {form.getValues('type') ===
              database.m3db.namespace.TypeEnum.aggregated && (
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2 mt-2">
                      <FormLabel>
                        {t('formNamespaceFieldResolutionLabel')}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <P>{t('formNamespaceFieldResolutionDescription')}</P>
                          <P>{t('formNamespaceFieldDurationDescription')}</P>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'formNamespaceFieldResolutionPlaceholder',
                        )}
                        disabled={
                          isPendingAddNamespace || isPendingEditNamespace
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Advanced configuration */}
            <div className="w-full rounded-md border-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex flex-row justify-between w-full font-semibold hover:text-"
                onClick={() => setAdvancedConfiguration(!advancedConfiguration)}
              >
                {t('formNamespaceButtonAdvancedConfiguration')}
                {advancedConfiguration ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
              {advancedConfiguration && (
                <div className="mx-3 mt-2 mb-4">
                  {/* WritesToCommitLogEnabled */}
                  <FormField
                    control={form.control}
                    name="writesToCommitLogEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center mt-1 justify-between">
                          <div className="flex items-center space-x-2">
                            <FormLabel>writesToCommitLogEnabled</FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="size-4" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <P>
                                  {t(
                                    'formNamespaceFieldWritesToCommitLogEnabledDescription',
                                  )}
                                </P>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Snapshot */}
                  <FormField
                    control={form.control}
                    name="snapshotEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center mt-1 justify-between">
                          <div className="flex items-center space-x-2">
                            <FormLabel>snapshotEnabled</FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="size-4" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <P>
                                  {t(
                                    'formNamespaceFieldSnapshotEnabledDescription',
                                  )}
                                </P>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* blockSizeDuration Retention */}
                  <FormField
                    control={form.control}
                    name="blockSizeDuration"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 mt-1">
                          <FormLabel>retention.blockSizeDuration</FormLabel>
                          <Popover>
                            <PopoverTrigger>
                              <HelpCircle className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent>
                              <P>
                                {t(
                                  'formNamespaceFieldBlockSizeDurationDescription',
                                )}
                              </P>
                              <P>
                                {t('formNamespaceFieldDurationDescription')}
                              </P>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input
                            placeholder={t(
                              'formNamespaceFieldDurationPlaceholder',
                            )}
                            disabled={
                              isEdition ||
                              isPendingAddNamespace ||
                              isPendingEditNamespace
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* bufferPastDuration */}
                  <FormField
                    control={form.control}
                    name="bufferPastDuration"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 mt-1">
                          <FormLabel>retention.bufferPastDuration</FormLabel>
                          <Popover>
                            <PopoverTrigger>
                              <HelpCircle className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent>
                              <P>
                                {t(
                                  'formNamespaceFieldBufferPastDurationDescription',
                                )}
                              </P>
                              <P>
                                {t('formNamespaceFieldDurationDescription')}
                              </P>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input
                            placeholder={t(
                              'formNamespaceFieldDurationPlaceholder',
                            )}
                            disabled={
                              isPendingAddNamespace || isPendingEditNamespace
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* bufferFutureDuration */}
                  <FormField
                    control={form.control}
                    name="bufferFutureDuration"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 mt-1">
                          <FormLabel>retention.bufferFutureDuration</FormLabel>
                          <Popover>
                            <PopoverTrigger>
                              <HelpCircle className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent>
                              <P>
                                {t(
                                  'formNamespaceFieldBufferFutureDurationDescription',
                                )}
                              </P>
                              <P>
                                {t('formNamespaceFieldDurationDescription')}
                              </P>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input
                            placeholder={t(
                              'formNamespaceFieldDurationPlaceholder',
                            )}
                            disabled={
                              isPendingAddNamespace || isPendingEditNamespace
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* blockDataExpirationDuration */}
                  <FormField
                    control={form.control}
                    name="blockDataExpirationDuration"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 mt-1">
                          <FormLabel>
                            retention.blockDataExpirationDuration
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger>
                              <HelpCircle className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent>
                              <P>
                                {t(
                                  'formNamespaceFieldDataExpirationDurationDescription',
                                )}
                              </P>
                              <P>
                                {t('formNamespaceFieldDurationDescription')}
                              </P>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input
                            placeholder={t(
                              'formNamespaceFieldDurationPlaceholder',
                            )}
                            disabled={
                              isPendingAddNamespace || isPendingEditNamespace
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t('formNamespaceButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPendingAddNamespace || isPendingEditNamespace}
              >
                {t(`${prefix}NamespaceButtonConfirm`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditNamespace;
