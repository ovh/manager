import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  Check,
  ChevronsUpDown,
  FileJson,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import {
  AdvancedConfigurationProperty,
  useAdvancedConfigurationForm,
} from './useAdvancedConfigurationForm.hook';
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
import { useServiceData } from '../../../Service.context';
import { useToast } from '@/components/ui/use-toast';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEditAdvancedConfiguration } from '@/hooks/api/database/advancedConfiguration/useEditAdvancedConfiguration.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

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
  const isDisabled =
    service.capabilities.advancedConfiguration?.update ===
    database.service.capability.StateEnum.disabled;
  const toast = useToast();
  const {
    updateAdvancedConfiguration,
    isPending,
  } = useEditAdvancedConfiguration({
    onError: (error) => {
      toast.toast({
        variant: 'destructive',
        title: t('advancedConfigurationUpdateErrorTitle'),
        description: getCdbApiErrorMessage(error),
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
    <div className="flex flex-col gap-2 mt-2">
      {/* Left Col */}
      <div className="flex flex-col pb-4 border-b">
        <Form {...model.form}>
          <form
            onSubmit={onSubmit}
            id="advancedConfigurationForm"
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
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
                      <FormControl
                        className="w-full"
                        data-testid="advanced-config-input"
                      >
                        {getInput(field, property)}
                      </FormControl>
                      {property.isDeletable && (
                        <Button
                          data-testid={`remove-property-${property.name}`}
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
            data-testid="advanced-config-add-button"
            variant={'ghost'}
            onClick={addProperty}
            className="text-primary rounded-full p-2 ml-2 hover:text-primary"
            disabled={isDisabled}
          >
            <PlusCircle />
          </Button>
        </div>
      </div>
      {/* Right Col */}
      <Accordion type="single" collapsible>
        <AccordionItem value="json" className="border-none">
          <AccordionTrigger className="text-base">
            <div className="flex items-center gap-2">
              <FileJson className="size-4" />
              <span>{t('advancedConfigurationJSONButton')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea
              className="p-2 bg-[#122844] text-white whitespace-pre w-full"
              viewportClassName="max-h-[400px]"
            >
              <div>
                {model.result.payload &&
                  JSON.stringify(model.result.payload, null, 2)}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {(model.form.formState.isDirty ||
        model.lists.properties.length !==
          Object.keys(advancedConfiguration).length) && (
        <div className="flex gap-2">
          <Button
            data-testid="advanced-config-cancel-button"
            disabled={isPending}
            variant="outline"
            role="button"
            onClick={() => model.methods.reset()}
          >
            {t('advancedConfigurationCancelButton')}
          </Button>
          <Button
            data-testid="advanced-config-submit-button"
            form="advancedConfigurationForm"
            disabled={isPending || isDisabled}
          >
            {t('advancedConfigurationSubmitButton')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedConfigurationForm;
