import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@datatr-ux/uxlib';
import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import storages from '@/types/Storages';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useObjectStorageData } from '../../ObjectStorage.context';
import { useUserForm } from './formUser/useUserForm.hook';
import { cn } from '@/lib/utils';
import { useAddS3Policy } from '@/data/hooks/s3-storage/useAddS3Policy.hook';

const SwithType = () => {
  const { t } = useTranslation('pci-object-storage/storages/user-s3');
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, storageId, region } = useParams();
  const s3Query = useGetS3(projectId, region, storageId);
  const [openUser, setOpenUser] = useState(false);

  const { users } = useObjectStorageData();

  const { form } = useUserForm({
    users,
  });

  const { addS3Policy, isPending } = useAddS3Policy({
    onError: (err) => {
      toast.toast({
        title: t('updateS3PolicyToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('updateS3PolicyToastSuccessTitle'),
        description: t('updateS3PolicyToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    addS3Policy({
      projectId,
      region,
      name: storageId,
      userId: formValues.userId,
      data: {
        roleName: formValues.userRole,
      },
    });
  });

  return (
    <RouteModal isLoading={!s3Query.data?.name}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="s3-policy-modal">
            {t('updateS3PolicyTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('updateS3PolicyDescription')}</DialogDescription>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userIdFieldLabel')}</FormLabel>
                  <Popover open={openUser} onOpenChange={setOpenUser}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          data-testid="select-user-button"
                          role="combobox"
                          mode="ghost"
                          className="w-full flex flex-row items-center justify-between text-sm border"
                        >
                          {field.value
                            ? `${
                                users.find((us) => us.id === field.value)
                                  ?.username
                              } - ${
                                users.find((us) => us.id === field.value)
                                  ?.description
                              }`
                            : t('userPlaceholder')}
                          <ChevronsUpDown className="opacity-50 size-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <Command>
                        <CommandInput
                          placeholder={t('inputUserPlaceholder')}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{t('noUserFound')}</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                value={user.username}
                                key={user.id}
                                onSelect={() => {
                                  form.setValue('userId', user.id);
                                  setOpenUser(false);
                                }}
                              >
                                {`${user.username} - ${user.description}`}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    user.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userRoleFieldLabel')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(storages.PolicyRoleEnum).map((role) => (
                          <SelectItem key={role} value={role}>
                            {t(`role_${role}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button type="button" mode="outline">
                  {t('updateS3PolicyButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                data-testid="s3-policy-submit-button"
                disabled={isPending}
              >
                {t('updateS3PolicyButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default SwithType;
