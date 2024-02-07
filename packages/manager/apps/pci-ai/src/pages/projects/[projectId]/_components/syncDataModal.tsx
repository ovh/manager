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
import { Check, ChevronsUpDown } from 'lucide-react';

import { ai } from '@/models/types';

export interface SyncDataSubmitData {
  syncType: string;
}

interface SyncDataModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SyncDataSubmitData) => void;
}

const SyncDataModal = ({ open, onClose, onSubmit }: SyncDataModalProps) => {
  // define the schema for the form
  const schema = z.object({
    syncType: z.string({
      required_error: 'Please select a synchronization type',
    }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a form controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      syncType: ai.volume.DataSyncEnum.pull,
    },
  });

  // handle form submission: forward values
  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    onSubmit({
      syncType: formValues.syncType,
    });
  };

  const syncTypeList = [
    { value: ai.volume.DataSyncEnum.pull },
    { value: ai.volume.DataSyncEnum.push },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (open === false ? onClose() : null)}
    >
      <DialogContent>
        <DialogTitle>Manually data synchronization</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitAndForward)} className="space-y-8">
            <FormField
              control={form.control}
              name="syncType"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Synchronisation type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? syncTypeList.find(
                                (synctype) => synctype.value === field.value,
                              )?.value
                            : 'Select synchronisation type'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search sync type" />
                        <CommandGroup>
                          {syncTypeList.map((synctype) => (
                            <CommandItem
                              value={synctype.value}
                              key={synctype.value}
                              onSelect={() => {
                                form.setValue('syncType', synctype.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  synctype.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {synctype.value}
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
              <Button type="submit">Synchronise</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SyncDataModal;
