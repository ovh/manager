import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  FieldLabel,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import storages from '@/types/Storages';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useObjectStorageData } from '../../../../ObjectStorage.context';
import { useUserForm } from './formUser/useUserForm.hook';
import { cn } from '@/lib/utils';
import { useAddS3Policy } from '@/data/hooks/s3-storage/useAddS3Policy.hook';
import { FormField } from '@/components/form-field/FormField.component';

const AddUserS3Modal = () => {
  const { t } = useTranslation('pci-object-storage/storages/user-s3');
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, storageId, region } = useParams();
  const s3Query = useGetS3({ projectId, region, name: storageId });
  const { users } = useObjectStorageData();
  const { form } = useUserForm({
    users,
  });

  const { addS3Policy, isPending } = useAddS3Policy({
    onError: (err) => {
      toast.toast({
        title: t('updateS3PolicyToastErrorTitle'),
        variant: 'critical',
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
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="s3-policy-modal">
            {t('updateS3PolicyTitle')}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <DialogDescription>
            {t('updateS3PolicyDescription')}
          </DialogDescription>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2 mt-2"
            id="addUserS3Form"
          >
            <FormField name="userId" form={form}>
              {(field) => (
                <>
                  <FieldLabel htmlFor={'userId-combobox'}>
                    {t('userIdFieldLabel')}
                  </FieldLabel>
                  <Combobox
                    value={`${field.value}`}
                    onValueChange={(val) => field.onChange(+val)}
                    modal
                  >
                    <ComboboxTrigger
                      id="userId-combobox"
                      ref={field.ref}
                      disabled={field.disabled}
                    >
                      <ComboboxValue
                        data-testid="select-user-button"
                        placeholder={t('userPlaceholder')}
                        value={
                          field.value &&
                          `${users.find((u) => u.id === field.value)
                            ?.username ?? ''} - ${users.find(
                            (u) => u.id === field.value,
                          )?.description ?? ''}`
                        }
                      />
                    </ComboboxTrigger>
                    <ComboboxContent>
                      <ComboboxInput placeholder={t('inputUserPlaceholder')} />
                      <ComboboxList>
                        <ComboboxEmpty>{t('noUserFound')}</ComboboxEmpty>
                        <ComboboxGroup>
                          {users.map((user, i) => (
                            <ComboboxItem
                              disabled={i === 2}
                              key={user.id}
                              value={`${user.id}`}
                              keywords={[user.username, user.description]}
                              className={cn(
                                'cursor-pointer hover:bg-primary-50',
                                'data-[disabled]:pointer-events-auto data-[disabled]:opacity-100',
                                'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-none data-[disabled=true]:!opacity-50',
                              )}
                            >
                              {`${user.username} - ${user.description}`}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </>
              )}
            </FormField>

            <FormField form={form} name="userRole">
              {(field) => (
                <>
                  <FieldLabel htmlFor={`userRole-select`}>
                    {t('userRoleFieldLabel')}
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      ref={field.ref}
                      disabled={field.disabled}
                      id="userRole-select"
                    >
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
                </>
              )}
            </FormField>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('updateS3PolicyButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            form="addUserS3Form"
            type="submit"
            data-testid="s3-policy-submit-button"
            disabled={isPending}
          >
            {t('updateS3PolicyButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddUserS3Modal;
