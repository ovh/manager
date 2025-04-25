import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@datatr-ux/uxlib';
import { useDockerForm } from './useDockerForm.hook';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import {
  AddEditMutateRegistryProps,
  useAddRegistry,
} from '@/data/hooks/ai/registry/useAddRegistry.hook';

const AddDocker = () => {
  const { projectId } = useParams();
  const { form } = useDockerForm();
  const navigate = useNavigate();
  const regionQuery = useGetRegions(projectId);
  const { t } = useTranslation('ai-tools/dashboard/docker');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();

  const AddDockerMutationProps: AddEditMutateRegistryProps = {
    onError(err) {
      toast.toast({
        title: t(`formDockerToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onAddSuccess(newRegistry) {
      form.reset();
      toast.toast({
        title: t('formDockerToastSuccessTitle'),
        description: t(`formDockerToastSuccessDescription`, {
          description: newRegistry.url,
        }),
      });
      form.reset();
      navigate('../');
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
    <RouteModal backUrl="../" isLoading={!regionQuery.isSuccess}>
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
                      <SelectTrigger data-testid="select-region-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regionQuery.data?.map((region) => (
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
                  mode="outline"
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
    </RouteModal>
  );
};

export default AddDocker;
