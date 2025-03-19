import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Button,
  DialogClose,
  DialogContent,
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
  useToast,
} from '@datatr-ux/uxlib';
import * as sshkey from '@datatr-ux/ovhcloud-types/cloud/index';

import { getAIApiErrorMessage } from '@/lib/apiHelper';

import RouteModal from '@/components/route-modal/RouteModal';
import { useGetSshkey } from '@/data/hooks/sshkey/useGetSshkey.hook';
import {
  UseAddSshKey,
  useAddSshKey,
} from '@/data/hooks/sshkey/useAddSshKey.hook';

const AddSSHKey = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/components/configuration');
  const navigate = useNavigate();

  const sshKeyQuery = useGetSshkey(projectId);

  const configuredSshKeys: sshkey.sshkey.SshKey[] = useMemo(() => {
    return sshKeyQuery.data;
  }, [sshKeyQuery.isSuccess]);

  const sshKeySchema = z.object({
    name: z
      .string()
      .min(1)
      .max(15)
      .refine(
        (newKeyName) =>
          !configuredSshKeys.some(
            (existingSSHKey) =>
              existingSSHKey.name.toLowerCase() === newKeyName.toLowerCase(),
          ),
        {
          message: t('duplicateKeyError'),
        },
      ),
    sshKey: z.string().min(1),
  });

  const form = useForm({
    resolver: zodResolver(sshKeySchema),
  });

  const toast = useToast();

  const sshKeyMutationConfig: UseAddSshKey = {
    onError(err) {
      toast.toast({
        title: t(`addSshKeyToastErrorTitle`),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onAddKeySuccess(sshKey) {
      form.reset();
      toast.toast({
        title: t('formConnectionPoolToastSuccessTitle'),
        description: t(`addSshKeySuccessDescription`, {
          name: sshKey.name,
        }),
      });
      navigate('../');
    },
  };

  const { addSSHKey, isPending } = useAddSshKey(sshKeyMutationConfig);

  const onSubmit = form.handleSubmit((formValues) => {
    const newSshKey: sshkey.ProjectSshkeyCreation = {
      name: formValues.name,
      publicKey: formValues.sshKey,
    };
    addSSHKey({ projectId, sshKey: newSshKey });
  });

  return (
    <RouteModal backUrl="../">
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-sshKey-modal">
            {t('addSshKeyTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="ssh-key-name-field-label">
                    {t('sshKeyFieldLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="ssh-key-input-field"
                      {...field}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sshKey"
              defaultValue=""
              render={({ field }) => (
                <FormItem data-testid="ssh-key-value-field-label">
                  <FormLabel>{t('sskKeyValueFieldLabel')}</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="ssh-rsa AAAAB3..."
                      className="w-full flex h-60 resize-none rounded-md border border-gray-100 bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      data-testid="ssh-key-value-input-field"
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
                  data-testid="add-ssh-key-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('formSshKeyButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="add-ssh-key-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('formSshKeyButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default AddSSHKey;
