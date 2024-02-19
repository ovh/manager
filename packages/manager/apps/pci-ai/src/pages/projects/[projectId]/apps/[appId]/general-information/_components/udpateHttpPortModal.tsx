import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Alert } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export interface UpdateHttpPortSubmitData {
  httpPort: number;
}

interface UpdateHttpPortModalProps {
  currentHttpPort: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateHttpPortSubmitData) => void;
}

const UpdateHttpPortModal = ({
  currentHttpPort,
  open,
  onClose,
  onSubmit,
}: UpdateHttpPortModalProps) => {
  // define the schema for the form
  const schema = z.object({
    httpPort: z
      .coerce.number()
      .min(1024)
      .max(65535),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      httpPort: currentHttpPort,
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    onSubmit({
      httpPort: formValues.httpPort,
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
          <DialogTitle>Update HTTP port</DialogTitle>
          <div className="text-black text-sm mb-4 mt-4">
            <Alert variant="default">
              <Info className="h-4 w-4" />
              <p>
                You can now change your application port. Your current
                configuration of other elements will also be retained, such as
                your HTTP endpoint or deployment strategy.
              </p>
              <p>
                Please note that there may be some lag on your various replica
                nodes if you use an auto-scaling deployment strategy.
              </p>
            </Alert>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitAndForward)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="httpPort"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="relative inline-block">
                      <FormLabel>Http port</FormLabel>
                    </div>
                    <Input type="number" {...field} />
                    <FormMessage />
                    <p className="mt-0 text-xs">
                      Enter the new HTTP port on which you want to deploy your app
                    </p>
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-end">
                <DialogClose asChild></DialogClose>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateHttpPortModal;
