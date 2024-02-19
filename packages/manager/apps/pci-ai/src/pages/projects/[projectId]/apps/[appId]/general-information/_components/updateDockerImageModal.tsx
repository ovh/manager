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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { HelpCircleIcon, Info } from 'lucide-react';

export interface UpdateDockerImageSubmitData {
  dockerImage: string;
}

interface UpdateDockerImageModalProps {
  currentDockerImage: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateDockerImageSubmitData) => void;
}

const UpdateDockerImageModal = ({
  currentDockerImage,
  open,
  onClose,
  onSubmit,
}: UpdateDockerImageModalProps) => {
  // define the schema for the form
  const schema = z.object({
    dockerImage: z
      .string()
      .min(1)
      .max(99),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      dockerImage: '',
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    onSubmit({
      dockerImage: formValues.dockerImage,
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
          <DialogTitle>Update Image</DialogTitle>
          <div className="text-black text-sm mb-4 mt-4">
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <p>
                  You can update your application's Docker image to offer an
                  up-to-date version of your service. Updates are incremental,
                  and will not result in any service disruptions. Your current
                  configuration will also be retained, such as your HTTP
                  endpoint and deployment strategy.
                </p>
                <p>
                  Please provide a different tag so that the Docker image update
                  is taken into account.
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
                name="dockerImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="relative inline-block">
                      <FormLabel>Your Docker image path</FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircleIcon className="ml-1 mt-1 w-3 h-3" />
                        </PopoverTrigger>
                        <PopoverContent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-80 text-sm text-muted-foreground">
                          <p>
                            Images hosted on a private or public registry are
                            accepted (GitHub, GitLab, DockerHub, etc.)
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input placeholder={currentDockerImage} {...field} />
                    <FormMessage />
                    <p className="mt-0 text-xs">
                      Enter the path to your Docker image. This can be a public
                      (GitHub, Gitlab, DockerHub, etc.) or private registry.
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

export default UpdateDockerImageModal;
