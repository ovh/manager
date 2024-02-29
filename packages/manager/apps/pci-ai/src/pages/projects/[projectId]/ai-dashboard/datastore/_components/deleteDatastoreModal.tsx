import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';

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
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DataStoreWithRegion } from '@/hooks/api/ai/useGetDatastores';

export interface DeleteDatastoreSubmitData {
  alias: string;
  region: string;
}

interface DeleteDatastoreModalProps {
  datastore: DataStoreWithRegion;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeleteDatastoreSubmitData) => void;
}

const DeleteDatastoreModal = ({
  datastore,
  open,
  onClose,
  onSubmit,
}: DeleteDatastoreModalProps) => {

  // define the schema for the form
  const schema = z.object({
    alias: z.string().min(1),
    region: z.string().min(1),
  });
  type ValidationSchema = z.infer<typeof schema>;
  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      alias: '',
      region: '',
    },
  });
  // fill form with service values
  useEffect(() => {
    if (!datastore) return;
    form.setValue('alias', datastore.alias);
    form.setValue('region', datastore.region)
  }, [datastore, form]);
  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    onSubmit({
      alias: formValues.alias,
      region: formValues.region,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (open === false ? onClose() : null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Datastore</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your datastore? 
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitAndForward)}>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild></DialogClose>
              <Button type="submit">
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDatastoreModal;
