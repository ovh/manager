import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as sshkey from '@/types/cloud/sshkey';
import { ModalController } from '@/hooks/useModale';
import {
  UseAddSshKey,
  useAddSshKey,
} from '@/hooks/api/sshkey/useAddSshKey.hook';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Button } from '@/components/ui/button';

interface AddSSHKeyProps {
  configuredSshKeys: sshkey.SshKey[];
  controller: ModalController;
  onSuccess?: (sshKey: sshkey.SshKey) => void;
  onError?: (error: Error) => void;
}

const AddSSHKey = ({
  configuredSshKeys,
  controller,
  onError,
  onSuccess,
}: AddSSHKeyProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-notebooks/components/configuration');
  const sshKeySchema = z.object({
    name: z
      .string()
      .min(1)
      .max(15)
      .refine(
        (newKeyName) =>
          !configuredSshKeys.some(
            (existingSSHKey) => existingSSHKey.name === newKeyName,
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

  useEffect(() => {
    if (!controller.open) form.reset();
  }, [controller.open]);

  const toast = useToast();

  const sshKeyMutationConfig: UseAddSshKey = {
    onError(err) {
      toast.toast({
        title: t(`addSshKeyToastErrorTitle`),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onAddKeySuccess(sshKey) {
      form.reset();
      toast.toast({
        title: t('formConnectionPoolToastSuccessTitle'),
        description: t(`addSshKeySuccessDescription`, {
          name: sshKey.name,
        }),
      });
      if (onSuccess) {
        onSuccess(sshKey);
      }
    },
  };

  const { addSSHKey, isPending } = useAddSshKey(sshKeyMutationConfig);

  const onSubmit = form.handleSubmit((formValues) => {
    const newSshKey: sshkey.SshKey = {
      name: formValues.name,
      publicKey: formValues.sshKey,
    };
    addSSHKey({ projectId, sshKey: newSshKey });
  });

  return (
    <Dialog {...controller}>
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
                  variant="outline"
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
    </Dialog>
  );
};

export default AddSSHKey;
