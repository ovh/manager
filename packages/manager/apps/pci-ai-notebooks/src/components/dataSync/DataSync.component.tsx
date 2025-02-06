import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as ai from '@/types/cloud/project/ai';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import RouteModal from '@/components/route-modal/RouteModal';

interface DataSyncModalProps {
  volume?: ai.volume.VolumeStatus;
  onSubmitSync: (direction: ai.volume.DataSyncEnum) => void;
  pending: boolean;
}

const DataSyncModal = ({
  volume,
  onSubmitSync,
  pending,
}: DataSyncModalProps) => {
  const { t } = useTranslation('components/containers');
  const dataSyncTypeRules = z.nativeEnum(ai.volume.DataSyncEnum);

  const schema = z.object({
    type: dataSyncTypeRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    type: ai.volume.DataSyncEnum.pull,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((formValues) => {
    onSubmitSync(formValues.type);
  });

  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="datasync-modal">
            {t('dataSyncTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center space-x-2 mt-2">
                    <FormLabel>{t('formDataSyncFieldTypeLabel')}</FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <p>{t('formDataSyncFieldTypeHelper')}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Select
                    value={field.value}
                    onValueChange={(value: ai.volume.DataSyncEnum) => {
                      form.setValue('type', value);
                    }}
                  >
                    <SelectTrigger data-testid="select-datasync-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ai.volume.DataSyncEnum).map(
                        (dataSyncType) => (
                          <SelectItem key={dataSyncType} value={dataSyncType}>
                            {dataSyncType}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormControl />
                  <FormMessage />
                </FormItem>
              )}
            />
            {volume ? (
              <p>
                {t('dataSyncMountPathAlertDescription', {
                  name: volume.mountPath,
                  interpolation: { escapeValue: false },
                })}
              </p>
            ) : (
              <p>{t('dataSyncGlobalAlertDescription')}</p>
            )}
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="datasync-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('datasyncButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="datasync-submit-button"
                type="submit"
                disabled={pending}
              >
                {t('datasyncButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default DataSyncModal;
