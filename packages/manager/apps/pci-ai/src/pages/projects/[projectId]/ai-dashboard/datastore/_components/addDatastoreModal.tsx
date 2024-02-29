import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { ai } from '@/models/types';
import { Switch } from '@/components/ui/switch';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface AddDatastoreSubmitData {
  alias: string;
  type: string;
  region: string;
  endpoint: string;
  git: {
    basicAuth?: {
      username?: string;
      password?: string;
    };
    sshKeypair?: {
      privateKey?: string;
      publicKey?: string;
    };
  };
  s3: {
    accessKey?: string;
    secretKey?: string;
    region?: string;
  };
}

interface AddDatastoreModalProps {
  regions: ai.capabilities.Region[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDatastoreSubmitData) => void;
}

const AddDatastoreModal = ({
  regions,
  open,
  onClose,
  onSubmit,
}: AddDatastoreModalProps) => {
  const [isGitDatastore, setIsGitDatastore] = useState(false);
  const [isBasicAuth, setIsBasicAuth] = useState(false);
  //Fixed FORM Management
  const schema = z
    .object({
      alias: z
        .string()
        .min(1)
        .max(50),
      region: z
        .string()
        .min(1)
        .max(3),
      endpoint: z
        .string()
        .min(1)
        .max(99),
      username: z.string().max(50),
      password: z.string().max(50),
      publicKey: z.string().max(200),
      privateKey: z.string().max(99),
      accessKey: z.string().max(99),
      secretKey: z.string().max(99),
      reg: z.string().max(20),
    })
    .superRefine((values, context) => {
      if (!isGitDatastore) {
        if (values.accessKey === '') {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Access key is a mandatory field',
            path: ['accessKey'],
          });
        } else if (values.secretKey === '') {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Secret Key is a mandatory field',
            path: ['secretKey'],
          });
        } else if (values.reg === '') {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Region is a mandatory field',
            path: ['reg'],
          });
        }
      } else {
        if (!isBasicAuth) {
          if (values.privateKey === '') {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Private key is a mandatory field',
              path: ['privateKey'],
            });
          }
        } else {
          if (values.username === '') {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Username is a mandatory field',
              path: ['username'],
            });
          } else if (values.password === '') {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Password is a mandatory field',
              path: ['password'],
            });
          }
        }
      }
    });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a fixedForm controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      alias: '',
      username: '',
      password: '',
      publicKey: '',
      privateKey: '',
      accessKey: '',
      secretKey: '',
      reg: '',
      region: regions[0]?.id || 'GRA',
      endpoint: '',
    },
  });

  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    const datastoreData: AddDatastoreSubmitData = {
      alias: formValues.alias,
      type: isGitDatastore ? ai.DataStoreTypeEnum.git : ai.DataStoreTypeEnum.s3,
      region: formValues.region,
      endpoint: formValues.endpoint,
      git: {},
      s3: {},
    }; 
    if (isGitDatastore) {
      if (isBasicAuth) {
        datastoreData.git.basicAuth = {
          username: formValues.username,
          password: formValues.password,
        };
      } else {
        datastoreData.git.sshKeypair = {
          privateKey: formValues.privateKey,
          publicKey: formValues.publicKey,
        };
      }
    } else {
      datastoreData.s3 = {
        accessKey: formValues.accessKey,
        secretKey: formValues.secretKey,
        region: formValues.reg,
      };
    }
    onSubmit(datastoreData);
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
          <DialogTitle className="mb-6">
            Create a GIT or S3 datastore
          </DialogTitle>

          <div className="flex flew-row items-center gap-4">
            <h3
              className={cn(!isGitDatastore ? 'font-semibold' : 'font-normal')}
            >
              S3 Datastore
            </h3>
            <Switch
              className="rounded-xl"
              id="sclaing"
              checked={isGitDatastore}
              onCheckedChange={(checked: boolean) => setIsGitDatastore(checked)}
            />
            <h3
              className={cn(isGitDatastore ? 'font-semibold' : 'font-normal')}
            >
              Git Datastore
            </h3>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitAndForward)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="flex flex-col my-3">
                    <FormLabel>Region</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="combobox"
                            size="combobox"
                            role="combobox"
                            className="w-[250px] justify-between"
                          >
                            {field.value
                              ? regions.find(
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
                            {regions.map((region) => (
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
                name="alias"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Alias</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Endpoint</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isGitDatastore ? (
                <>
                  <FormField
                    control={form.control}
                    name="accessKey"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Access Key</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secretKey"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Secret Key</FormLabel>
                        <Input type="password" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reg"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Region</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <RadioGroup
                    defaultValue="ssh"
                    className="flex flew-row items-center gap-3"
                    onValueChange={(value) => setIsBasicAuth(value !== 'ssh')}
                  >
                    <RadioGroupItem value="ssh" id="ssh" />
                    <Label>SSH Key</Label>
                    <RadioGroupItem value="basic" id="basic" />
                    <Label>Basic authentification</Label>
                  </RadioGroup>
                  {!isBasicAuth ? (
                    <>
                      <FormField
                        control={form.control}
                        name="privateKey"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>SSH Private key</FormLabel>
                            <Input type="password" {...field} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="publicKey"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>SSH Public key (optional)</FormLabel>
                            <Input
                              placeholder="ssh-rsa AAAAB3..."
                              className="resize-none h-32"
                              type="text"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </>
              )}
              <DialogFooter className="flex justify-end">
                <DialogClose asChild></DialogClose>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddDatastoreModal;
