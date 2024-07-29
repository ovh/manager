import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { ModalController } from '@/hooks/useModale.hook';
import { user } from '@/types/user';
import { useUserForm } from './useUserForm.hook';
import { useToast } from '@/components/ui/use-toast';
import { MutateUserProps, useAddUser } from '@/hooks/api/user/useAddUser.hook';
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
import { Alert } from '@/components/ui/alert';

interface AddUserModalProps {
  controller: ModalController;
  onSuccess?: (user?: user.User) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

const AddUser = ({
  controller,
  onSuccess,
  onError,
  onClose,
}: AddUserModalProps) => {
  const [newPass, setNewPass] = useState<string>();
  const { projectId } = useParams();
  const { form } = useUserForm();

  useEffect(() => {
    if (!controller.open) {
      form.reset();
      setNewPass(undefined);
    }
  }, [controller.open]);

  const { t } = useTranslation('pci-ai-dashboard/users');
  const toast = useToast();

  const AddUserMutationProps: MutateUserProps = {
    onError(err) {
      toast.toast({
        title: t(`formUserToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess(newUser) {
      form.reset();
      toast.toast({
        title: t('formUserToastSuccessTitle'),
        description: t(`formUserToastSuccessDescription`, {
          description: newUser.description,
        }),
      });
      setNewPass(newUser.password);
      if (onSuccess) {
        onSuccess(newUser);
      }
    },
  };
  const { addUser, isPending } = useAddUser(AddUserMutationProps);

  const onSubmit = form.handleSubmit((formValues) => {
    const userCreation: user.UserCreation = {
      description: formValues.description,
      role: formValues.userRole,
    };
    addUser({
      projectId,
      newUser: userCreation,
    });
  });

  const handleCopyPass = () => {
    navigator.clipboard.writeText(newPass);
    toast.toast({
      title: t('formUserPasswordCopy'),
    });
  };

  const handleClose = () => {
    setNewPass(undefined);
    onClose();
  };

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="add-user-modal">
            {t(`formAddUserTitle`)}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        {newPass ? (
          <div>
            <Alert variant="success">
              <p>{t('formUserPasswordSuccess')}</p>
              <div className="relative my-2">
                <Button
                  data-testid="user-password-copy-button"
                  onClick={() => handleCopyPass()}
                  className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
                >
                  <Copy className="size-4" />
                  <span className="sr-only">copy</span>
                </Button>
                <pre className="p-4 bg-gray-100 rounded">
                  <code>{newPass}</code>
                </pre>
              </div>
            </Alert>
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  data-testid="user-close-button"
                  type="button"
                  variant="outline"
                >
                  {t('formAddUserButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('formAddUserFieldDescriptionLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-testid="user-description-input"
                        placeholder="description"
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
                name="userRole"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 mt-2">
                    <FormLabel>{t('formAddUserFieldRoleLabel')}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(user.AIUserRoleEnum).map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button
                    data-testid="add-user-cancel-button"
                    type="button"
                    variant="outline"
                  >
                    {t('formAddUserButtonCancel')}
                  </Button>
                </DialogClose>
                <Button
                  data-testid="add-user-submit-button"
                  type="submit"
                  disabled={isPending}
                >
                  {t(`formAddUserButtonConfirm`)}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
