import { Trans, useTranslation } from 'react-i18next';

import { useNavigate, useParams } from 'react-router-dom';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
  useToast,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DialogFooter,
  DialogClose,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useMemo } from 'react';
import { HelpCircle } from 'lucide-react';
import * as database from '@/types/cloud/project/database';
import RouteModal from '@/components/route-modal/RouteModal';
import TagsInput from '@/components/tags-input/TagsInput.component';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import {
  useAddReplication,
  UseAddReplication,
} from '@/hooks/api/database/replication/useAddReplication.hook';
import { TOAST } from '@/configuration/toast.constants';
import { useEditReplication } from '@/hooks/api/database/replication/useEditReplication.hook';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';

interface AddEditReplicationModalProps {
  editedReplication?: database.service.Replication;
  replications: database.service.Replication[];
  service: database.Service;
}
export interface IntegrationWithServiceData
  extends database.service.Integration {
  sourceIntegrationService?: database.Service;
  targetIntegrationService: database.Service;
}

const AddEditReplication = ({
  editedReplication,
  service,
}: AddEditReplicationModalProps) => {
  const isEdition = !!editedReplication?.id;
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/replications',
  );
  const prefix = isEdition ? 'edit' : 'add';
  const toast = useToast();

  const servicesQuery = useGetServices(projectId);
  const integrationsQuery = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
  );

  const integrationsWithServiceData: IntegrationWithServiceData[] = useMemo(
    () =>
      integrationsQuery.data
        ?.filter(
          (i) =>
            i.type === database.service.integration.TypeEnum.kafkaMirrorMaker,
        )
        .map((integration) => ({
          ...integration,
          sourceIntegrationService: servicesQuery.data?.find(
            (s) => integration.sourceServiceId === s.id,
          ),
          targetIntegrationService: servicesQuery.data?.find(
            (s) => integration.destinationServiceId === s.id,
          ),
        })),
    [servicesQuery.data, integrationsQuery.data],
  );

  const schema = z.object({
    sourceIntegration: z.string(),
    targetIntegration: z.string(),
    topics: z.array(z.string()),
    topicExcludeList: z.array(z.string()),
    syncGroupOffsets: z.boolean(),
    syncInterval: z.coerce.number().max(31536000),
    replicationPolicyClass: z.nativeEnum(
      database.service.replication.PolicyClassEnum,
    ),
    emitHeartbeats: z.boolean(),
    enabled: z.boolean(),
  });

  const topicsSchema = z
    .string()
    .min(1, {
      message: t('formReplicationErrorMinLength', {
        min: 1,
      }),
    })
    .max(1024, {
      message: t('formReplicationErrorMaxLength', {
        max: 1024,
      }),
    })
    .regex(/^[A-Za-z0-9-_.*?]+$/, {
      message: t('formReplicationCategoriesErrorPattern'),
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceIntegration: editedReplication?.sourceIntegration || undefined,
      targetIntegration: editedReplication?.targetIntegration || undefined,
      replicationPolicyClass:
        editedReplication?.replicationPolicyClass || undefined,
      topics: editedReplication?.topics || [],
      topicExcludeList: editedReplication?.topicExcludeList || [],
      syncInterval: editedReplication?.syncInterval || 60,
      syncGroupOffsets: editedReplication?.syncGroupOffsets || false,
      emitHeartbeats: editedReplication?.emitHeartbeats || true,
      enabled: editedReplication?.enabled || true,
    },
  });

  const ReplicationMutationProps: UseAddReplication = {
    onError(err) {
      toast.toast({
        title: t(`${prefix}ReplicationToastErrorTitle`),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
        duration: TOAST.ERROR_DURATION,
      });
    },
    onSuccess() {
      form.reset();
      toast.toast({
        title: t('formReplicationToastSuccessTitle'),
        description: t(`${prefix}ReplicationToastSuccessDescription`),
      });
      navigate('../');
    },
  };

  const {
    addReplication,
    isPending: isPendingAddReplication,
  } = useAddReplication(ReplicationMutationProps);

  const {
    editReplication,
    isPending: isPendingEditReplication,
  } = useEditReplication(ReplicationMutationProps);

  const onSubmit = form.handleSubmit((formValues) => {
    if (isEdition) {
      editReplication({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        replication: {
          id: editedReplication.id,
          ...formValues,
        } as database.service.Replication,
      });
    } else {
      addReplication({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        replication: formValues as database.service.Replication,
      });
    }
  });

  const sourceIntegrationList = integrationsWithServiceData ?? [];
  const targetIntegrationList = integrationsWithServiceData ?? [];

  return (
    <RouteModal>
      <DialogContent className="px-0 sm:max-w-2xl">
        <DialogHeader className="p-6">
          <DialogTitle data-testid="add-edit-replication-modal">
            {t(`${prefix}ReplicationTitle`)}
          </DialogTitle>
          <DialogDescription>
            {t(`${prefix}ReplicationDescription`)}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] px-4 overflow-auto">
          <Form {...form}>
            <form
              id="addEditReplication"
              onSubmit={onSubmit}
              className="flex flex-col md:grid gap-4 grid-cols-2 p-2"
            >
              <FormField
                control={form.control}
                name="sourceIntegration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addEditReplicationSourceLabel')}</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isEdition}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger ref={field.ref}>
                          <SelectValue
                            placeholder={t(
                              'addEditReplicationSourceLabelPlaceholder',
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceIntegrationList.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.sourceIntegrationService.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetIntegration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addEditReplicationTargetLabel')}</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isEdition}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger ref={field.ref}>
                          <SelectValue
                            placeholder={t(
                              'addEditReplicationTargetLabelPlaceholder',
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {targetIntegrationList.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.sourceIntegrationService.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addEditReplicationTopicsLabel')}</FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        placeholder={t('addEditReplicationTopicsPlaceholder')}
                        value={field.value}
                        onChange={(newTags) => form.setValue('topics', newTags)}
                        schema={topicsSchema}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topicExcludeList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('addEditReplicationTopicsExcludeListLabel')}
                    </FormLabel>
                    <FormControl>
                      <TagsInput
                        {...field}
                        placeholder={t(
                          'addEditReplicationTopicsExcludeListPlaceholder',
                        )}
                        value={field.value}
                        onChange={(newTags) =>
                          form.setValue('topicExcludeList', newTags)
                        }
                        schema={topicsSchema}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="syncGroupOffsets"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {t('addEditReplicationSyncGroupOffsetsLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="syncGroupOffsets"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          ref={field.ref}
                        />
                        <span className="mr-2">
                          {field.value
                            ? t('addEditReplicationSyncGroupOffsetsEnabled')
                            : t('addEditReplicationSyncGroupOffsetsDisabled')}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="syncInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('addEditReplicationSyncIntervalLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="replicationPolicyClass"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <FormLabel className="flex items-center gap-2 py-1">
                        {t('addEditReplicationReplicationPolicyClassLabel')}
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                      </FormLabel>
                      <PopoverContent className="w-[420px] text-sm">
                        <div className="flex flex-col gap-4">
                          <p>{t('addEditReplicationPolicyClassPopover1')}</p>
                          <p>{t('addEditReplicationPolicyClassPopover2')}</p>
                          <p>{t('addEditReplicationPolicyClassPopover3')}</p>
                          <p>{t('addEditReplicationPolicyClassPopover4')}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {/* </div> */}
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger ref={field.ref}>
                          <SelectValue
                            placeholder={t(
                              'addEditReplicationPolicyClassPlaceholder',
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(
                            database.service.replication.PolicyClassEnum,
                          ).map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emitHeartbeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('addEditReplicationEmitHeartbeatsLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          ref={field.ref}
                        />
                        <span className="mr-2">
                          {field.value
                            ? t('addEditReplicationEmitHeartbeatsEnabled')
                            : t('addEditReplicationEmitHeartbeatsDisabled')}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addEditReplicationEnabledLabel')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          ref={field.ref}
                        />
                        <span className="mr-2">
                          {field.value
                            ? t('addEditReplicationStatusEnabled')
                            : t('addEditReplicationStatusDisabled')}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="flex gap-2 justify-end mt-4 px-6">
          <DialogClose asChild>
            <Button
              data-testid="add-edit-replication-cancel-button"
              type="button"
              mode="outline"
            >
              {t('addEditReplicationCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="add-edit-replication-submit-button"
            type="submit"
            form="addEditReplication"
            disabled={isPendingAddReplication || isPendingEditReplication}
          >
            {t(`${prefix}ReplicationConfirm`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddEditReplication;
