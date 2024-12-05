import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
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
import RouteModal from '@/components/route-modal/RouteModal';

const DataSync = () => {
  const { volumeId } = useParams();
  const [volume, setVolume] = useState<ai.volume.VolumeStatus>();
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/attached-data',
  );
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!volumeId) return;
    const volumeToSync: ai.volume.VolumeStatus = notebook.status.volumes.find(
      (vol: ai.volume.VolumeStatus) => vol.id === volumeId,
    );
    if (volumeId && !volumeToSync) navigate('../');
    setVolume(volumeToSync);
  }, [volumeId]);

  const { dataSync, isPending } = useDataSync({
    onError: (err) => {
      toast.toast({
        title: t('dataSyncToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      const toastdesc: string = volume
        ? t('dataSyncMountPathToastSuccessDescription', {
            name: volume.mountPath,
            interpolation: { escapeValue: false },
          })
        : t('dataSyncGlobalToastSuccessDescription');
      toast.toast({
        title: t('dataSyncToastSuccessTitle'),
        description: toastdesc,
      });
      navigate('../');
    },
  });

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
                disabled={isPending}
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

export default DataSync;
