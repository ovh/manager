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
import { useDockerForm } from './useDockerForm.hook';
import {
  AddEditMutateRegistryProps,
  useAddRegistry,
} from '@/hooks/api/ai/registry/useAddRegistry.hook';

interface AddDockerModalProps {
  regions: ai.capabilities.Region[];
  controller: ModalController;
  onSuccess?: (registry?: ai.registry.Registry) => void;
  onError?: (error: Error) => void;
}

const AddDocker = ({
  regions,
  controller,
  onSuccess,
  onError,
}: AddDockerModalProps) => {
  const { projectId } = useParams();
  const { form } = useDockerForm({ regions });

  useEffect(() => {
    if (!controller.open) {
      form.reset();
    }
  }, [controller.open]);

  const { t } = useTranslation('pci-ai-dashboard/docker');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();

  const AddDockerMutationProps: AddEditMutateRegistryProps = {
    onError(err) {
      toast.toast({
        title: t(`formDockerToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess(newRegistry) {
      form.reset();
      toast.toast({
        title: t('formDockerToastSuccessTitle'),
        description: t(`formDockerToastSuccessDescription`, {
          description: newRegistry.url,
        }),
      });
      form.reset();
      if (onSuccess) {
        onSuccess(newRegistry);
      }
    },
  };
  const { addRegistry, isPending } = useAddRegistry(AddDockerMutationProps);

  const onSubmit = form.handleSubmit((formValues) => {
    const registryCreation = {
      region: formValues.region,
      username: formValues.username,
      url: formValues.url,
      password: formValues.password,
    };
    addRegistry({
      projectId,
      registry: registryCreation,
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-docker-modal">
            {t(`formAddDockerTitle`)}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <FormLabel>{t('formAddDockerFieldRegionLabel')}</FormLabel>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formAddDockerFieldUsernameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="docker-username-input"
                      placeholder={t('formAddDockerFieldUsernamePlaceholder')}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formAddDockerFieldPasswordLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      data-testid="docker-password-input"
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formAddDockerFieldUrlLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="docker-url-input"
                      placeholder={t('formAddDockerFieldUrlPlaceholder')}
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
                  data-testid="add-docker-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('formAddDockerButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="add-docker-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t(`formAddDockerButtonConfirm`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocker;
