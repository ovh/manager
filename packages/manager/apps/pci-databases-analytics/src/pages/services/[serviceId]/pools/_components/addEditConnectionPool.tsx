import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import SizeInput from './formPools/sizeSelect';

import {
  UseConnectionPoolFormProps,
  useConnectionPoolForm,
} from './formPools/formConnectionPool.hook';
import {
  useAddConnectionPool,
  useEditConnectionPool,
} from '@/hooks/api/connectionPool.api.hooks';
import { ModalController } from '@/hooks/useModale';

import { GenericUser } from '@/api/databases/users';
import { database } from '@/models/database';
import { POOL_CONFIG } from './formPools/connectionPool.const';
import { ConnectionPoolEdition } from '@/models/databaseEdition';

interface AddEditConnectionPoolModalProps {
  isEdition: boolean;
  editedConnectionPool?: database.postgresql.ConnectionPool;
  connectionPools?: database.postgresql.ConnectionPool[];
  users: GenericUser[];
  databases: database.service.Database[];
  service: database.Service;
  controller: ModalController;
  onSuccess?: (connectionPool?: database.postgresql.ConnectionPool) => void;
  onError?: (error: Error) => void;
}
const AddEditConnectionPoolModal = ({
  isEdition,
  editedConnectionPool,
  connectionPools,
  users,
  databases,
  service,
  controller,
  onSuccess,
  onError,
}: AddEditConnectionPoolModalProps) => {
  const { projectId } = useParams();
  const formProps: UseConnectionPoolFormProps = isEdition
    ? { editedConnectionPool }
    : { existingConnectionPools: connectionPools };

  const { form } = useConnectionPoolForm(formProps);
  useEffect(() => {
    if (!controller.open) form.reset();
  }, [controller.open]);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const toast = useToast();
  const {
    addConnectionPool,
    isPending: isPendingAddPool,
  } = useAddConnectionPool({
    onError: (err) => {
      toast.toast({
        title: t('addConnectionPoolToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (cp) => {
      form.reset();
      toast.toast({
        title: t('formConnectionPoolToastSuccessTitle'),
        description: t('addConnectionPoolToastSuccessDescription', {
          name: cp.name,
        }),
      });
      if (onSuccess) {
        onSuccess(cp);
      }
    },
  });

  const {
    editConnectionPool,
    isPending: isPendingEditPool,
  } = useEditConnectionPool({
    onError: (err) => {
      toast.toast({
        title: t('editConnectionPoolToastErrorTitle'),
        variant: 'destructive',
        description: err.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (cp) => {
      form.reset();
      toast.toast({
        title: t('formConnectionPoolToastSuccessTitle'),
        description: t('editConnectionPoolToastSuccessDescription', {
          name: cp.name,
        }),
      });
      if (onSuccess) {
        onSuccess(cp);
      }
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    if (isEdition) {
      const connectionPool: ConnectionPoolEdition = {
        databaseId: formValues.databaseId,
        mode: formValues.mode,
        size: formValues.size,
      };
      if (formValues.userId.length > 1) {
        connectionPool.userId = formValues.userId;
      }
      if (Object.entries(form.formState.dirtyFields).length === 0) {
        onSuccess();
        return;
      }
      editConnectionPool({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connectionPoolId: editedConnectionPool.id,
        connectionPool,
      });
    } else {
      const connectionPool: database.postgresql.ConnectionPoolCreation = {
        databaseId: formValues.databaseId,
        mode: formValues.mode,
        name: formValues.name,
        size: formValues.size,
      };
      if (formValues.userId.length > 1) {
        connectionPool.userId = formValues.userId;
      }
      addConnectionPool({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connectionPool,
      });
    }
  });

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdition
              ? t('editConnectionPoolTitle')
              : t('addConnectionPoolTitle')}
          </DialogTitle>
          {!isEdition && (
            <DialogDescription>
              {t('addConnectionPoolDescription')}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            {/* PoolName */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formConnectionPoolFieldNameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      disabled={
                        isEdition || isPendingAddPool || isPendingEditPool
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="databaseId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <FormLabel>
                    {t('formConnectionPoolFieldDatabaseLabel')}
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {databases.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
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
              name="mode"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <FormLabel>{t('formConnectionPoolFieldModeLabel')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(
                          database.postgresql.connectionpool.ModeEnum,
                        ).map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
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
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formUserFieldSizeLabel')}</FormLabel>
                  <FormControl>
                    <SizeInput
                      value={field.value}
                      onChange={(newValue) => form.setValue('size', newValue)}
                      min={POOL_CONFIG.size.min}
                      max={POOL_CONFIG.size.max}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 mt-2">
                  <FormLabel>{t('formConnectionPoolFieldUserLabel')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'formConnectionPoolFieldUserPlaceholder',
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key={1} value="-">
                          -
                        </SelectItem>
                        {users.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.username}
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
                <Button type="button" variant="outline">
                  {t('formConnectionButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPendingAddPool || isPendingEditPool}
              >
                {isEdition
                  ? t('editConnectionButtonConfirm')
                  : t('addConnectionButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditConnectionPoolModal;
