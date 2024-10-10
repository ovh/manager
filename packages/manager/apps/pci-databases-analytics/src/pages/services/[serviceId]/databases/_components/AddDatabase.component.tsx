import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
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
import * as database from '@/types/cloud/project/database';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import { useAddDatabase } from '@/hooks/api/database/database/useAddDatabase.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface AddDatabaseModalProps {
  service: database.Service;
  controller: ModalController;
  onSuccess?: (database: database.service.Database) => void;
  onError?: (error: Error) => void;
}

const AddDatabase = ({
  service,
  controller,
  onError,
  onSuccess,
}: AddDatabaseModalProps) => {
  // import translations
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/databases',
  );
  const toast = useToast();
  const { addDatabase, isPending } = useAddDatabase({
    onError: (err) => {
      toast.toast({
        title: t('addDatabaseToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (addedDb) => {
      toast.toast({
        title: t('addDatabaseToastSuccessTitle'),
        description: t('addDatabaseToastSuccessDescription', {
          name: addedDb.name,
        }),
      });
      if (onSuccess) {
        onSuccess(addedDb);
      }
    },
  });
  // define the schema for the form
  const schema = z.object({
    name: z
      .string()
      .min(3, {
        message: t('addDatabaseErrorMinLength', { min: 1 }),
      })
      .max(100, {
        message: t('addDatabaseErrorMaxLength', { max: 100 }),
      }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    addDatabase({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      name: formValues.name,
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-database-modal">
            {t('addDatabaseTitle')}
          </DialogTitle>
          <DialogDescription>{t('addDatabaseDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addDatabaseInputLabel')}</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="add-database-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  data-testid="add-database-cancel-button"
                >
                  {t('addDatabaseButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                data-testid="add-database-submit-button"
              >
                {t('addDatabaseButtonAdd')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDatabase;
