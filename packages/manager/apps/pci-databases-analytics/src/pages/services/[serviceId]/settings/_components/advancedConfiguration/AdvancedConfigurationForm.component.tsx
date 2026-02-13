import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { FileJson, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Input,
  useToast,
  Button,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Code,
  json,
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import {
  AdvancedConfigurationProperty,
  useAdvancedConfigurationForm,
} from './useAdvancedConfigurationForm.hook';
import { useServiceData } from '../../../Service.context';
import { useEditAdvancedConfiguration } from '@/data/hooks/database/advancedConfiguration/useEditAdvancedConfiguration.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

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
  const { projectId, service, serviceQuery } = useServiceData();
  const isDisabled = isCapabilityDisabled(
    service,
    'advancedConfiguration',
    'update',
  );

  const toast = useToast();
  const {
    updateAdvancedConfiguration,
    isPending,
  } = useEditAdvancedConfiguration({
    onError: (error) => {
      toast.toast({
        variant: 'critical',
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
                  <FormItem className="flex flex-col gap-2 border rounded-md p-2 w-full">
                    <div className="flex flex-row gap-2 items-center w-full min-w-0">
                      <FormLabel className="break-words whitespace-normal flex-1 min-w-0">
                        {property.name}
                      </FormLabel>
                      {property.isDeletable && (
                        <Button
                          data-testid={`remove-property-${property.name}`}
                          mode="ghost"
                          variant="critical"
                          className="p-1 h-auto shrink-0"
                          type="button"
                          onClick={() => model.methods.removeProperty(property)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                    <FormControl
                      className="w-full"
                      data-testid="advanced-config-input"
                    >
                      {getInput(field, property)}
                    </FormControl>
                    <FormDescription>{property.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <div className="flex mt-4">
          <Combobox value={value} onValueChange={setValue}>
            <ComboboxTrigger>
              <ComboboxValue
                placeholder={t('advancedConfigurationAddPropertyPlaceholder')}
                value={
                  model.lists.availableProperties.find(
                    (property) => property.name === value,
                  )?.name
                }
              />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput placeholder="Search property..." />
              <ComboboxList>
                <ComboboxEmpty>
                  {t('advancedConfigurationAddPropertyNotFound')}
                </ComboboxEmpty>
                <ComboboxGroup>
                  {model.lists.availableProperties.map((property) => (
                    <ComboboxItem key={property.name} value={property.name}>
                      {property.name}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <Button
            data-testid="advanced-config-add-button"
            mode={'ghost'}
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
            <Code
              className="max-h-[400px]"
              lang={json}
              code={
                model.result.payload
                  ? JSON.stringify(model.result.payload, null, 2)
                  : '{}'
              }
            ></Code>
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
            mode="outline"
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
