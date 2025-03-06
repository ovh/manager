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
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { useGitForm } from './useGitForm.hook';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import {
  AddEditMutateDatastoreProps,
  useAddDatastore,
} from '@/data/hooks/ai/data/useAddDatastore.hook';

const AddGit = () => {
  const { projectId } = useParams();
  const { form } = useGitForm();
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/dashboard/git');
  const { t: tRegions } = useTranslation('regions');
  const toast = useToast();
  const regionsQuery = useGetRegions(projectId);

  const AddGitMutationPropos: AddEditMutateDatastoreProps = {
    onError(err) {
      toast.toast({
        title: t(`formGitToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onAddSuccess() {
      toast.toast({
        title: t('formGitToastSuccessTitle'),
        description: t(`formGitToastSuccessDescription`),
      });
      navigate('../');
    },
  };
  const { addDatastore, isPending } = useAddDatastore(AddGitMutationPropos);

  const onSubmit = form.handleSubmit((formValues) => {
    const gitCreds: ai.DataStoreCredentialsInput =
      formValues.credentialsType === 'basicAuth'
        ? {
            git: {
              basicAuth: {
                username: formValues.username,
                password: formValues.password,
              },
            },
          }
        : {
            git: {
              sshKeypair: {
                publicKey: formValues.publicKey,
                privateKey: formValues.privateKey,
              },
            },
          };

    const gitCreation: ai.DataStoreInput = {
      alias: formValues.alias,
      endpoint: formValues.endpoint,
      owner: ai.DataStoreOwnerEnum.customer,
      type: ai.DataStoreTypeEnum.git,
      credentials: gitCreds,
    };
    addDatastore({
      projectId,
      region: formValues.region,
      datastore: gitCreation,
    });
  });

  return (
    <RouteModal backUrl="../" isLoading={!regionsQuery.isSuccess}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-git-modal">
            {t(`formAddGitTitle`)}
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
                  <FormLabel>{t('formAddGitFieldAliasLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="git-alias-input"
                      placeholder={t('formAddGitFieldAliasPlaceholder')}
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
                  <FormLabel>{t('formAddGitFieldEndpointLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="git-endpoint-input"
                      placeholder={t('formAddGitFieldEndpointPlaceholder')}
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
                  <FormLabel>{t('formAddGitFieldRegionLabel')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-region-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regionsQuery.data?.map((region) => (
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
              name="credentialsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formAddGitFieldCredTypeLabel')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        form.resetField('password');
                        form.resetField('username');
                        form.resetField('publicKey');
                        form.resetField('privateKey');
                        field.onChange(value);
                      }}
                      value={field.value}
                      className="grid grid-cols-3 gap-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-basic-auth"
                            value={'basicAuth'}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('formAddGitFieldBasicAuthLabel')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-ssh-key"
                            value={'sshKeypair'}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('formAddGitFieldSSHKeyLabel')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues('credentialsType') === 'basicAuth' ? (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formAddGitFieldUserNameLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="git-username-input"
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
                      <FormLabel>{t('formAddGitFieldPasswordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          data-testid="git-password-input"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="publicKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('formAddGitFieldPublicKeyLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          data-testid="git-public-key-input"
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
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('formAddGitFieldPrivateKeyLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          data-testid="git-private-key-input"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button
                  data-testid="add-git-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('formAddGitButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="add-git-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t(`formAddGitButtonConfirm`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default AddGit;
