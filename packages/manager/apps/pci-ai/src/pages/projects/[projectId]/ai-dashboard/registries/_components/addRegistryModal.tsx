import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ChevronDown } from 'lucide-react';

import { ai } from '@/models/types';
import { Input } from '@/components/ui/input';

export interface AddRegistrySubmitData {
  region: string;
  username: string;
  password: string;
  dockerUrl: string;
}

interface AddRegistryModalProps {
  regionsList: ai.capabilities.Region[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddRegistrySubmitData) => void;
}

const AddRegistryModal = ({
  regionsList,
  open,
  onClose,
  onSubmit,
}: AddRegistryModalProps) => {
  // define the schema for the form
  const schema = z.object({
    region: z.string({
      required_error: 'Please select a region',
    }),
    username: z
      .string()
      .min(1)
      .max(50),
    password: z
      .string()
      .min(1)
      .max(50),
    dockerUrl: z
      .string()
      .min(1)
      .max(50),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      region: regionsList[0]?.id || 'GRA',
      username: '',
      password: '',
      dockerUrl: '',
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    onSubmit({
      username: formValues.username,
      password: formValues.password,
      dockerUrl: formValues.dockerUrl,
      region: formValues.region,
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
        <DialogTitle>Create an AI token</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitAndForward)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Region</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="combobox"
                          size="combobox"
                          role="combobox"
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? regionsList.find(
                                (region) => region.id === field.value,
                              )?.id
                            : 'Select your region'}
                          <ChevronDown className="text-primary ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search region" />
                        <CommandGroup>
                          {regionsList.map((region) => (
                            <CommandItem
                              value={region.id}
                              key={region.id}
                              onSelect={() => {
                                form.setValue('region', region.id || '');
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  region.id === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {region.id}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dockerUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Private Docker Registry URL</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose></DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRegistryModal;
