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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DialogBody,
} from '@datatr-ux/uxlib';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal.component';
import { useAddTopicAcl } from '@/data/hooks/database/topicAcl/useAddTopicAcl.hook';

const PERMISSIONS = ['admin', 'read', 'write', 'readwrite'] as const;

const AddTopicAcl = () => {
  // import translations
  const { service, projectId } = useServiceData();
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topicAcls',
  );
  const toast = useToast();
  const { addTopicAcl, isPending } = useAddTopicAcl({
    onError: (err) => {
      toast.toast({
        title: t('addTopicAclToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (addedTopic) => {
      toast.toast({
        title: t('addTopicAclToastSuccessTitle'),
        description: t('addTopicAclToastSuccessDescription', {
          username: addedTopic.username,
        }),
      });
      navigate('../');
    },
  });
  const schema = z.object({
    username: z
      .string()
      .min(3, { message: t('addTopicAclErrorMinLength', { min: 3 }) })
      .max(100, { message: t('addTopicAclErrorMaxLength', { max: 100 }) }),
    topic: z
      .string()
      .min(1, { message: t('addTopicAclErrorMinLength', { min: 1 }) })
      .max(100, { message: t('addTopicAclErrorMaxLength', { max: 100 }) }),
    permission: z.enum(PERMISSIONS),
  });

  type FormSchema = z.infer<typeof schema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      topic: '',
      permission: 'read',
    },
  });

  const onSubmit = form.handleSubmit(
    ({ username, topic, permission }: FormSchema) => {
      addTopicAcl({
        serviceId: service.id,
        projectId,
        engine: service.engine,
        topicAcl: {
          username,
          topic,
          permission,
        },
      });
    },
  );

  return (
    <RouteModal isLoading={!service}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="add-topic-acl-modal">
            {t('addTopicAclTitle')}
          </DialogTitle>
          <DialogDescription>{t('addTopicAclDescription')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="grid gap-4"
              id="addTopicAclForm"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addTopicAclUsernameLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="add-topic-acl-username-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addTopicAclTopicLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="add-topic-acl-topic-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addTopicAclPermissionLabel')}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        data-testid="add-topic-acl-permission-input"
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PERMISSIONS.map((permission) => (
                            <SelectItem value={permission}>
                              {permission}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              mode="ghost"
              data-testid="add-topic-acl-cancel-button"
            >
              {t('addTopicAclButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            form="addTopicAclForm"
            type="submit"
            disabled={isPending}
            data-testid="add-topic-acl-submit-button"
          >
            {t('addTopicAclButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddTopicAcl;
