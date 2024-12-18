import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ModalController } from '@/hooks/useModale.hook';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import * as ai from '@/types/cloud/project/ai';
import { useDatastoreForm } from './useDatastoreForm.hook';
import {
  AddEditMutateDatastoreProps,
  useAddDatastore,
} from '@/hooks/api/ai/datastore/useAddDatastore.hook';

interface AddDatastoreModalProps {
  regions: ai.capabilities.Region[];
  controller: ModalController;
  onSuccess?: (datastore?: ai.DataStore) => void;
  onError?: (error: Error) => void;
}

const AddDatastore = ({
  regions,
  controller,
  onSuccess,
  onError,
}: AddDatastoreModalProps) => {
  const { projectId } = useParams();
  const { form } = useDatastoreForm({ regions });

  useEffect(() => {
    if (!controller.open) {
      form.reset();
    }
  }, [controller.open]);

  const { t } = useTranslation('pci-ai-dashboard/datastores');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();

  const AddDatastoreMutationPropos: AddEditMutateDatastoreProps = {
    onError(err) {
      toast.toast({
        title: t(`formDatastoreToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess(newDatastore) {
      form.reset();
      toast.toast({
        title: t('formDatastoreToastSuccessTitle'),
        description: t(`formDatastoreToastSuccessDescription`),
      });
      form.reset();
      if (onSuccess) {
        onSuccess(newDatastore);
      }
    },
  };
  const { addDatastore, isPending } = useAddDatastore(
    AddDatastoreMutationPropos,
  );

  const onSubmit = form.handleSubmit((formValues) => {
    const datastoreCreation: ai.DataStoreInput = {
      alias: formValues.alias,
      endpoint: formValues.endpoint,
      owner: ai.DataStoreOwnerEnum.customer,
      type: ai.DataStoreTypeEnum.s3,
      credentials: {
        s3: {
          accessKey: formValues.s3AccessKey,
          secretKey: formValues.s3SecretKey,
          region: formValues.s3Region,
        },
      },
    };
    addDatastore({
      projectId,
      region: formValues.region,
      datastore: datastoreCreation,
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-datastore-modal">
            {t(`formAddDatastoreTitle`)}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formAddDatastoreFieldAliasLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="datastore-alias-input"
                      placeholder={t('formAddDatastoreFieldAliasPlaceholder')}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('formAddDatastoreFieldEndpointLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="datastore-endpoint-input"
                      placeholder={t(
                        'formAddDatastoreFieldEndpointPlaceholder',
                      )}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <FormLabel>{t('formAddDatastoreFieldRegionLabel')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id}>
                            {tRegions(`region_${region.id}`)}
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
              name="s3AccessKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('formAddDatastoreFieldAccessKeyLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="datastore-access-key-input"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="s3SecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('formAddDatastoreFieldSecretKeyLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      data-testid="datastore-secret-key-input"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="s3Region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('formAddDatastoreFieldS3RegionLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="datastore-s3-region-input"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button
                  data-testid="add-datastore-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('formAddDatastoreButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="add-datastore-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t(`formAddDatastoreButtonConfirm`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDatastore;
