import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { database } from '@/models/database';
import {
  AdvancedConfigurationProperty,
  useAdvancedConfigurationForm,
} from './advancedConfiguration.hook';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useServiceData } from '../../../layout';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateAdvancedConfiguration } from '@/hooks/api/advancedConfiguration.api.hook';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface AdvancedConfigurationFormProps {
  advancedConfiguration: Record<string, string>;
  capabilities: database.capabilities.advancedConfiguration.Property[];
  onSucces: () => void;
}
const AdvancedConfigurationForm = ({
  advancedConfiguration,
  capabilities,
  onSucces,
}: AdvancedConfigurationFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const { projectId, service, serviceQuery } = useServiceData();
  const toast = useToast();
  const {
    updateAdvancedConfiguration,
    isPending,
  } = useUpdateAdvancedConfiguration({
    onError: (error) => {
      toast.toast({
        variant: 'destructive',
        title: t('advancedConfigurationUpdateErrorTitle'),
        description: error.response.data.message,
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('advancedConfigurationUpdateSuccessTitle'),
        description: t('advancedConfigurationUpdateSuccessDescription'),
      });
      onSucces();
      serviceQuery.refetch();
    },
  });

  const model = useAdvancedConfigurationForm({
    initialValue: advancedConfiguration,
    capabilities,
  });
  const getInput = (
    field: ControllerRenderProps<FieldValues, string>,
    capability: AdvancedConfigurationProperty,
  ) => {
    switch (capability.type) {
      case database.capabilities.advancedConfiguration.property.TypeEnum
        .boolean:
        return (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value?.toString()}
            className="flex flex-col space-y-1"
            ref={field.ref}
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="true" />
              </FormControl>
              <FormLabel className="font-normal">true</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="false" />
              </FormControl>
              <FormLabel className="font-normal">false</FormLabel>
            </FormItem>
          </RadioGroup>
        );
      case database.capabilities.advancedConfiguration.property.TypeEnum.double:
      case database.capabilities.advancedConfiguration.property.TypeEnum.long:
        return <Input type="number" value={field.value} {...field} />;
      case database.capabilities.advancedConfiguration.property.TypeEnum.string:
        if (capability.values) {
          return (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-1"
              ref={field.ref}
            >
              {capability.values.map((capabilityValue) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={capabilityValue}
                >
                  <FormControl>
                    <RadioGroupItem value={capabilityValue} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {capabilityValue}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          );
        }
        return <Input type="text" {...field} />;

      default:
        return <p>Unknown input type</p>;
    }
  };
  const onSubmit = model.form.handleSubmit(() => {
    updateAdvancedConfiguration({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      advancedConfiguration: model.result.payload,
    });
  });
  const addProperty = () => {
    const selectedProperty = model.lists.availableProperties.find(
      (p) => p.name === value,
    );
    if (selectedProperty) {
      model.methods.addProperty(selectedProperty);
      setValue('');
    }
  };
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 mt-2">
      {/* Left Col */}
      <div className="flex flex-col">
        <Form {...model.form}>
          <form
            onSubmit={onSubmit}
            id="advancedConfigurationForm"
            className="flex flex-col gap-2"
          >
            {model.lists.properties.map((property) => (
              <FormField
                key={property.name}
                control={model.form.control}
                name={model.methods.sanitizePropertyName(property.name)}
                render={({ field }) => (
                  <FormItem className="border rounded-md p-2 relative">
                    <FormLabel>{property.name}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl className="w-full">
                        {getInput(field, property)}
                      </FormControl>
                      {property.isDeletable && (
                        <Button
                          className="text-red-500 rounded-full p-1 hover:text-red-500 absolute top-0 right-0"
                          variant={'ghost'}
                          type="button"
                          onClick={() => model.methods.removeProperty(property)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                    <FormDescription>{property.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <div className="flex mt-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="input"
                size="input"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {value
                  ? model.lists.availableProperties.find(
                      (property) => property.name === value,
                    )?.name
                  : t('advancedConfigurationAddPropertyPlaceholder')}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
              <Command>
                <CommandInput placeholder="Search property..." />
                <ScrollArea className="max-h-64 overflow-auto">
                  <CommandEmpty>
                    {t('advancedConfigurationAddPropertyNotFound')}
                  </CommandEmpty>
                  <CommandGroup>
                    {model.lists.availableProperties.map((property) => (
                      <CommandItem
                        key={property.name}
                        value={property.name}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === property.name
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {property.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            variant={'ghost'}
            onClick={addProperty}
            className="text-primary rounded-full p-2 ml-2 hover:text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
      </div>
      {/* Right Col */}
      <div className="flex flex-col max-h-[500px] sticky top-4 gap-2">
        <ScrollArea className="p-2 h-auto bg-[#122844] text-white whitespace-pre w-full">
          {model.result.payload &&
            JSON.stringify(model.result.payload, null, 2)}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {(model.form.formState.isDirty ||
          model.lists.properties.length !==
            Object.keys(advancedConfiguration).length) && (
          <div className="flex gap-2">
            <Button
              disabled={isPending}
              variant="outline"
              role="button"
              onClick={() => model.methods.reset()}
            >
              {t('advancedConfigurationCancelButton')}
            </Button>
            <Button form="advancedConfigurationForm" disabled={isPending}>
              {t('advancedConfigurationSubmitButton')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedConfigurationForm;
