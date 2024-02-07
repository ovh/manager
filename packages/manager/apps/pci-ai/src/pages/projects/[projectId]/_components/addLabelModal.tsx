import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface AddLabelSubmitData {
  key: string;
  value: string;
}

interface AddLabelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddLabelSubmitData) => void;
}

const AddLabelModal = ({ open, onClose, onSubmit }: AddLabelModalProps) => {
  // define the schema for the form
  const schema = z.object({
    key: z
      .string()
      .min(1)
      .max(20),
    value: z
      .string()
      .min(1)
      .max(20),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      key: '',
      value: '',
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    onSubmit({
      key: formValues.key,
      value: formValues.value,
    });
  };

  const handleClose = (value: boolean) => {
    if (value) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a label</DialogTitle>
          <DialogDescription>
            You are about to create a new label for your product
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitAndForward)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Key</FormLabel>
                    <Input placeholder="enter your key" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Value</FormLabel>
                    <Input placeholder="enter your value" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end">
                <DialogClose asChild></DialogClose>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddLabelModal;
