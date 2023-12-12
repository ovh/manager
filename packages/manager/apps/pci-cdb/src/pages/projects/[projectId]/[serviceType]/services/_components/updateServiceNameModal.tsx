import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { database } from '@/models/database';

export interface UpdateServiceSubmitData {
  serviceEngine: string;
  serviceId: string;
  description: string;
}

interface UpdateServiceNameModalProps {
  service: database.Service;
  open: boolean;
  onClose: () => void;
  disabled: boolean;
  onSubmit: (data: UpdateServiceSubmitData) => void;
}

const UpdateServiceNameModal = ({
  service,
  open,
  onClose,
  disabled,
  onSubmit,
}: UpdateServiceNameModalProps) => {
  // import translations
  const { t } = useTranslation('common');
  // define the schema for the form
  const schema = z.object({
    description: z
      .string()
      .min(3, {
        message: t('cdb_pci_service_name_min_length_error', { min: 3 }),
      })
      .max(30, {
        message: t('cdb_pci_service_name_max_length_error', { max: 30 }),
      }),
    id: z.string().length(36),
    engine: z.string().min(1),
  });
  type ValidationSchema = z.infer<typeof schema>;
  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      id: '',
      engine: '',
    },
  });
  // fill form with service values
  useEffect(() => {
    if (!service) return;
    form.setValue('description', service.description);
    form.setValue('id', service.id);
    form.setValue('engine', service.engine);
  }, [service, form]);
  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    onSubmit({
      description: formValues.description,
      serviceEngine: formValues.engine,
      serviceId: formValues.id,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenValue) =>
        newOpenValue === false ? onClose() : null
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit service name</DialogTitle>
          <DialogDescription>
            Change your service name for a easier service management.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitAndForward)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" disabled={disabled} {...field} />
                  </FormControl>
                  <FormDescription>This is your service name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose asChild></DialogClose>
              <Button type="submit" disabled={disabled}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceNameModal;
