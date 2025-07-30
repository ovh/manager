import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal';
import {
  UseAddTopic,
  useAddTopic,
} from '@/hooks/api/database/topic/useAddTopic.hook';
import { useEditTopic } from '@/hooks/api/database/topic/useEditTopic.hook';

interface AddEditTopicProps {
  editedTopic?: database.kafka.Topic;
  topics: database.kafka.Topic[];
  service: database.Service;
}
const AddEditTopic = ({ service, topics, editedTopic }: AddEditTopicProps) => {
  const navigate = useNavigate();
  const { projectId } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topics',
  );
  const toast = useToast();
  const isEdition = !!editedTopic?.id;
  const prefix = isEdition ? 'edit' : 'add';

  const TopicMutationProps: UseAddTopic = {
    onError: (err) => {
      toast.toast({
        title: t(`${prefix}TopicToastErrorTitle`),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (addedTopic) => {
      toast.toast({
        title: t(`${prefix}TopicToastSuccessTitle`),
        description: t(`${prefix}TopicToastSuccessDescription`, {
          name: addedTopic.name,
        }),
      });
      navigate('../');
    },
  };

  const { addTopic, isPending: isPendingAddTopic } = useAddTopic(
    TopicMutationProps,
  );
  const { editTopic, isPending: isPendingEditTopic } = useEditTopic(
    TopicMutationProps,
  );

  // define the schema for the form
  const schema = z.object({
    name: z
      .string()
      .regex(/^[a-zA-Z0-9_.-]{1,249}$/, {
        message: t('formTopicErrorPattern'),
      })
      .min(3, {
        message: t('formTopicErrorMinLength', { min: 3 }),
      })
      .max(249, {
        message: t('formTopicErrorMaxLength', { max: 249 }),
      })
      .refine(
        (value) =>
          !topics
            .map((topic) => topic.name)
            .filter((n) => n !== editedTopic?.name)
            .includes(value),
        {
          message: t('formTopicNameErrorDuplicate'),
        },
      ),
    replication: z.coerce
      .number()
      .min(2, {
        message: t('formTopicErrorReplicationMin', { min: 2 }),
      })
      .max(service.nodes.length, {
        message: t('formTopicErrorReplicationMax', {
          max: service.nodes.length,
        }),
      }),
    partitions: z.coerce.number().min(1, {
      message: t('formTopicErrorPartitionsMin', { min: 1 }),
    }),
    retentionHours: z.coerce.number().min(-1, {
      message: t('formTopicErrorRetentionHoursMin', { min: -1 }),
    }),
    minInsyncReplicas: z.coerce.number().min(1, {
      message: t('formTopicErrorMinInsyncReplicasMin', { min: 1 }),
    }),
    retentionBytes: z.coerce.number().min(-1, {
      message: t('formTopicErrorRetentionBytesMin', { min: -1 }),
    }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editedTopic?.name || '',
      minInsyncReplicas: editedTopic?.minInsyncReplicas || 2,
      replication: editedTopic?.replication || 3,
      partitions: editedTopic?.partitions || 1,
      retentionBytes: editedTopic?.retentionBytes || -1,
      retentionHours: editedTopic?.retentionHours || -1,
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    if (isEdition) {
      editTopic({
        serviceId: service.id,
        projectId,
        engine: service.engine,
        topic: {
          ...editedTopic,
          replication: formValues.replication,
          partitions: formValues.partitions,
          minInsyncReplicas: formValues.minInsyncReplicas,
          retentionBytes: formValues.retentionBytes,
          retentionHours: formValues.retentionHours,
        },
      });
    } else {
      addTopic({
        serviceId: service.id,
        projectId,
        engine: service.engine,
        topic: {
          name: formValues.name,
          replication: formValues.replication,
          partitions: formValues.partitions,
          minInsyncReplicas: formValues.minInsyncReplicas,
          retentionBytes: formValues.retentionBytes,
          retentionHours: formValues.retentionHours,
        },
      });
    }
  });

  return (
    <RouteModal isLoading={!service}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="add-topic-modal">
            {t(`${prefix}TopicTitle`)}
          </DialogTitle>
          <DialogDescription>
            {t(`${prefix}TopicDescription`)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addTopicInputNameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="add-topic-name-input"
                      disabled={isEdition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Accordion
              type="single"
              collapsible
              className="border border-border p-2 rounded-md"
            >
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-base font-semibold py-2">
                  {t('addTopicAdvancedConfigurationTrigger')}
                </AccordionTrigger>
                <AccordionContent className="px-1">
                  <FormField
                    control={form.control}
                    name="minInsyncReplicas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('addTopicInputMinInsyncReplicasLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="add-topic-min-insync-replicas-input"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partitions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('addTopicInputPartitionsLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="add-topic-partitions-input"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('addTopicInputReplicationLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="add-topic-replication-input"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="retentionBytes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('addTopicInputRetentionBytesLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="add-topic-retention-bytes-input"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="retentionHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('addTopicInputRetentionHoursLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="add-topic-retention-hours-input"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>{t('addTopicInputCleanupPolicy')}</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        value={'default'}
                        data-testid="add-topic-cleanup-policy-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  mode="outline"
                  data-testid="add-topic-cancel-button"
                >
                  {t('addTopicButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPendingAddTopic || isPendingEditTopic}
                data-testid="add-topic-submit-button"
              >
                {t(`${prefix}TopicButtonConfirm`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default AddEditTopic;
