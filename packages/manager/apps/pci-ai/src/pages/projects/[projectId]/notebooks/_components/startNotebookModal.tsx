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

export interface StartNotebookSubmitData {
  notebookId: string;
}

interface StartNotebookModalProps {
  notebook: ai.notebook.Notebook;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StartNotebookSubmitData) => void;
}

const StartNotebookModal = ({
  notebook,
  open,
  onClose,
  onSubmit,
}: StartNotebookModalProps) => {

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
    if (!notebook) return;
    form.setValue('id', notebook.id);
  }, [notebook, form]);
  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    onSubmit({
      notebookId: formValues.id,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (open === false ? onClose() : null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Notebook</DialogTitle>
          <DialogDescription>
            Are you sure you want to start your notebook? 
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

export default StartNotebookModal;
