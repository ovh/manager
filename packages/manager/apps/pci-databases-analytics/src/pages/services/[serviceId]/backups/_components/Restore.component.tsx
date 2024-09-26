import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import * as database from '@/types/cloud/project/database';
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
import { ForkSourceType } from '@/types/orderFunnel';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useServiceData } from '../../Service.context';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { formatStorage } from '@/lib/bytesHelper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { CdbError } from '@/data/api/database';
import { useRestoreBackup } from '@/hooks/api/database/backup/useRestoreBackup.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface RestoreServiceModalProps {
  controller: ModalController;
  backups: database.Backup[];
  backup?: database.Backup;
  onSuccess?: () => void;
  onError?: (error: CdbError) => void;
}

const RestoreServiceModal = ({
  controller,
  backups,
  backup,
  onSuccess,
  onError,
}: RestoreServiceModalProps) => {
  // import translations
  const dateLocale = useDateFnsLocale();
  const { projectId, service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups',
  );
  const toast = useToast();
  const { restoreBackup, isPending } = useRestoreBackup({
    onError: (err) => {
      toast.toast({
        title: t('restoreBackupToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('restoreBackupToastSuccessTitle'),
        description: t('restoreBackupToastSuccessDescription'),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const canUsePointInTime = service.backups.pitr;
  const minPitrDate = canUsePointInTime ? new Date(service.backups.pitr) : null;
  // define the schema for the form
  const schema = z
    .object({
      type: z.enum(['now', 'pit', 'backup']),
      serviceId: z.string().length(36),
      backupId: z.string().optional(),
      pointInTime: z.date().optional(),
    })
    .refine(
      (data) => {
        if (['now', 'pit'].includes(data.type)) return canUsePointInTime;
        return true;
      },
      {
        message: t('errorSourceTypeFieldInvalid'),
        path: ['type'],
      },
    )
    .refine(
      (data) => {
        if (data.type === 'pit') {
          if (!data.pointInTime) return false;
          if (minPitrDate && data.pointInTime < minPitrDate) return false;
          if (data.pointInTime > new Date()) return false;
        }
        return true;
      },
      { message: t('errorSourcePITFieldInvalidDate'), path: ['pointInTime'] },
    )
    .refine(
      (data) => {
        if (data.type === 'backup') {
          if (!data.backupId) return false;
        }
        return true;
      },
      { message: t('errorSourceBackupFieldEmpty'), path: ['backupId'] },
    );
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: service.id,
      type: ForkSourceType.backup,
      backupId: backup?.id,
      pointInTime: new Date(),
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    restoreBackup({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      backupId: formValues.backupId,
      restore: {
        pointInTime:
          formValues.type === 'now'
            ? new Date().toISOString()
            : formValues.pointInTime.toISOString(),
      },
    });
  });

  useEffect(() => {
    form.reset();
  }, [controller.open]);
  useEffect(() => {
    form.setValue('backupId', backup?.id);
  }, [backup]);

  const selectedType = form.watch('type');
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="restore-modal">
            {t('restoreModalTitle')}
          </DialogTitle>
          <DialogDescription>{t('restoreModalDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inputSourceTypeLabel')}</FormLabel>
                  <FormDescription>
                    {t('inputSourceTypeDescription')}
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-3 gap-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="restore-modal-radio-now"
                            value={ForkSourceType.now}
                            disabled={!canUsePointInTime}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('inputTypeValueNow')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="restore-modal-radio-pitr"
                            value={ForkSourceType.pit}
                            disabled={!canUsePointInTime}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('inputTypeValuePIT')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={ForkSourceType.backup} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('inputTypeValueBackup')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType === ForkSourceType.backup && (
              <FormField
                control={form.control}
                name="backupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('inputSourceBackupLabel')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger ref={field.ref}>
                          <SelectValue
                            placeholder={t('inputSourceBackupPlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {backups.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                <FormattedDate
                                  date={new Date(b.createdAt)}
                                  options={{
                                    dateStyle: 'medium',
                                    timeStyle: 'medium',
                                  }}
                                />{' '}
                                ({formatStorage(b.size)})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {selectedType === ForkSourceType.pit && (
              <FormField
                control={form.control}
                name="pointInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('inputSourcePITPlaceholder')}</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={field.ref}
                            variant={'ghost'}
                            className={cn(
                              'text-left justify-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              <FormattedDate
                                date={field.value}
                                options={{
                                  dateStyle: 'medium',
                                  timeStyle: 'medium',
                                }}
                              />
                            ) : (
                              <span>{t('inputSourcePITPlaceholder')}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={dateLocale}
                            disabled={(date) =>
                              date > new Date() ||
                              date < new Date(service.backups?.pitr)
                            }
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="flex justify-end">
              <Button
                data-testid="restore-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('restoreButtonValidate')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreServiceModal;
