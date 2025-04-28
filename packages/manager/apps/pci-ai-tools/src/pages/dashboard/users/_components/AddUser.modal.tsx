import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  Button,
  Code,
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
  docker,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { useUserForm } from './useUserForm.hook';
import RouteModal from '@/components/route-modal/RouteModal';
import { MutateUserProps, useAddUser } from '@/data/hooks/user/useAddUser.hook';

const AddUser = () => {
  const [newPass, setNewPass] = useState<string>();
  const { projectId } = useParams();
  const { form } = useUserForm();
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/dashboard/users');
  const toast = useToast();

  const AddUserMutationProps: MutateUserProps = {
    onError(err) {
      toast.toast({
        title: t(`formUserToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onAddSuccess(newUser) {
      form.reset();
      toast.toast({
        title: t('formUserToastSuccessTitle'),
        description: t(`formUserToastSuccessDescription`, {
          description: newUser.description,
        }),
      });
      setNewPass(newUser.password);
    },
  };
  const { addUser, isPending } = useAddUser(AddUserMutationProps);

  const onSubmit = form.handleSubmit((formValues) => {
    const userCreation = {
      description: formValues.description,
      role: formValues.userRole,
    };
    addUser({
      projectId,
      newUser: userCreation,
    });
  });

  const handleClose = () => {
    setNewPass(undefined);
    navigate('../');
  };

  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-user-modal">
            {t(`formAddUserTitle`)}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        {newPass ? (
          <>
            <p>{t('formUserPasswordSuccess')}</p>
            <div data-testid="code-container" className="p-2">
              <Code
                code={newPass}
                label={t('formUserLabel')}
                lang={docker}
                theme={githubDark}
                onCopied={() =>
                  toast.toast({
                    title: t('formUserPasswordCopy'),
                  })
                }
              />
            </div>
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  data-testid="user-close-button"
                  type="button"
                  mode="outline"
                >
                  {t('formAddUserButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
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
                          {Object.values(ai.TokenRoleEnum).map((option) => (
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
                    mode="outline"
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
    </RouteModal>
  );
};

export default AddUser;
