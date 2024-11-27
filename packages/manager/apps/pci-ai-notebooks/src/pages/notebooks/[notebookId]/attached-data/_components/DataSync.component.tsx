import { useTranslation } from 'react-i18next';
import { HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { ModalController } from '@/hooks/useModale';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useDataSyncForm } from './formDataSync/useDataSyncForm.hook';
import { useDataSync } from '@/hooks/api/ai/notebook/datasync/useDataSync.hook';
import { useNotebookData } from '../../Notebook.context';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataSyncModalProps {
  volume?: ai.volume.Volume;
  controller: ModalController;
  onSuccess?: () => void;
  onError?: (service: Error) => void;
}

const DataSync = ({
  volume,
  controller,
  onError,
  onSuccess,
}: DataSyncModalProps) => {
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/attached-data',
  );
  const toast = useToast();

  const { form } = useDataSyncForm();

  const { dataSync, isPending } = useDataSync({
    onError: (err) => {
      toast.toast({
        title: t('dataSyncToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      const toastdesc: string = volume
        ? t('dataSyncMountPathToastSuccessDescription', {
            name: volume.mountPath,
          })
        : t('dataSyncGlobalToastSuccessDescription');
      toast.toast({
        title: t('dataSyncToastSuccessTitle'),
        description: toastdesc,
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const dataSyncFormValues: ai.volume.DataSyncSpec = {
      direction: formValues.type,
    };
    if (volume)
      dataSyncFormValues.volume = notebook.status.volumes.find(
        (vol: ai.volume.VolumeStatus) => vol.mountPath === volume.mountPath,
      )?.id;

    dataSync({
      projectId,
      notebookId: notebook.id,
      dataSyncSpec: dataSyncFormValues,
    });
  });

  return (
    <Dialog {...controller}>
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
                    <SelectTrigger>
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
                  <Alert variant="info">
                    <AlertDescription className="mt-2 text-base">
                      <div className="flex flex-row gap-5 items-center">
                        <Info className="h-7 w-7" />
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
                      </div>
                    </AlertDescription>
                  </Alert>

                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                disabled={isPending}
              >
                {t('datasyncButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DataSync;
