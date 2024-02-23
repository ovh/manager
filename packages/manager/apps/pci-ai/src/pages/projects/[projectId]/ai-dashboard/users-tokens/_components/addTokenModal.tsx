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
import { formattedTokenRole } from '@/data/constant';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface AddTokenSubmitData {
  name: string;
  label?: string;
  userRole: string;
  region: string;
}

interface AddTokenModalProps {
  regionsList: ai.capabilities.Region[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddTokenSubmitData) => void;
}

const AddTokenModal = ({ regionsList, open, onClose, onSubmit }: AddTokenModalProps) => {

  // define the schema for the form
  const schema = z.object({
    name: z
      .string()
      .min(1)
      .regex(/^[\w]+/)
      .max(30),
    label: z
      .string()
      .regex(/(^[\w]+=[\w-]+$)/, {
        message:
        'The label selector must be in the following form: label=value',
      })
      .max(99)
      .optional()
      .or(z.literal("")),
    userRole: z.string({
      required_error: 'Please select a user role',
    }),
    region: z.string({
      required_error: 'Please select a region',
    }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      label: '',
      userRole: formattedTokenRole(ai.TokenRoleEnum.ai_training_operator),
      region: regionsList[0]?.id || "GRA",
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    onSubmit({
      name: formValues.name,
      label: formValues.label,
      userRole:
        userRoleList.find((user) => user.value === formValues.userRole)?.key ||
        '',
      region: formValues.region,
    });
  };

  const userRoleList = [
    {
      key: ai.TokenRoleEnum.ai_training_operator,
      value: formattedTokenRole(ai.TokenRoleEnum.ai_training_operator),
    },
    {
      key: ai.TokenRoleEnum.ai_training_read,
      value: formattedTokenRole(ai.TokenRoleEnum.ai_training_read),
    },
  ];

  const handleClose = (value: boolean) => {
    if (value) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent>
        <DialogTitle>Create an AI token</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitAndForward)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Description</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className='text-sm'>
                Tokens can be assigned to a specific resource (AI Notebook, Job
                and App) using label selectors — or if you leave the field
                empty, they can be assigned to all your resources. You can also
                specify token privileges to include administrative or read-only
                rights.
              </p>
              <div className="flex flew-row gap-2 mt-3">
                <p className='text-sm'>Example selectors:</p>
                <Badge variant="error">label=valeur</Badge>
                <Badge variant="error">id=uuid</Badge>
                <Badge variant="error">type=app</Badge>
              </div>
              <div className="flex flew-row gap-2 mt-3">
                <p className='text-sm'>By default, your applications will have the following labels:</p>
                <Badge variant="error">id</Badge>
                <Badge variant="error">type</Badge>
              </div>
            </div>
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Label selector (optional)</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Role</FormLabel>
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
                            ? userRoleList.find(
                                (userRole) => userRole.value === field.value,
                              )?.value
                            : 'Select your Role'}
                          <ChevronDown className="text-primary ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search role type" />
                        <CommandGroup>
                          {userRoleList.map((userRole) => (
                            <CommandItem
                              value={userRole.value}
                              key={userRole.key}
                              onSelect={() => {
                                form.setValue('userRole', userRole.value || '');
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  userRole.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {userRole.value}
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
            <DialogFooter className="flex justify-end">
              <DialogClose></DialogClose>
              <Button type="submit">Generate</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTokenModal;
