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

import { ai } from '@/models/types';


export interface DeleteRegistrySubmitData {
  registryId: string;
}

interface DeleteRegistryModalProps {
  registry: ai.registry.Registry;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeleteRegistrySubmitData) => void;
}

const DeleteRegistryModal = ({
  registry,
  open,
  onClose,
  onSubmit,
}: DeleteRegistryModalProps) => {

  // define the schema for the form
  const schema = z.object({
    id: z.string().length(36),
  });
  type ValidationSchema = z.infer<typeof schema>;
  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: '',
    },
  });
  // fill form with service values
  useEffect(() => {
    if (!registry) return;
    form.setValue('id', registry.id);
  }, [registry, form]);
  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    onSubmit({
      registryId: formValues.id,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (open === false ? onClose() : null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Registry</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your registry? 
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

export default DeleteRegistryModal;
