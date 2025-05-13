import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';

export interface UseAdvancedConfigurationFormProps {
  initialValue: Record<string, string>;
  capabilities: database.capabilities.advancedConfiguration.Property[];
}
export interface AdvancedConfigurationProperty
  extends database.capabilities.advancedConfiguration.Property {
  isDeletable: boolean;
  defaultValue: string | boolean | number;
}

export const useAdvancedConfigurationForm = ({
  initialValue,
  capabilities,
}: UseAdvancedConfigurationFormProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  // sanitize the property name to avoid mismatch with errors handlers
  const sanitizePropertyName = (name: string) => name.replaceAll('.', ':');
  const getInitialProperties = () => {
    const initialProperties: AdvancedConfigurationProperty[] = [];
    Object.keys(initialValue).forEach((key) => {
      const capability = capabilities.find((c) => c.name === key);
      initialProperties.push({
        ...capability,
        defaultValue: initialValue[key],
        isDeletable: false,
      });
    });
    return initialProperties;
  };

  const getDefaultValues = (properties: AdvancedConfigurationProperty[]) => {
    const values: Record<string, number | string | boolean> = {};
    properties.forEach((property) => {
      let val = property.defaultValue;
      switch (property.type) {
        case database.capabilities.advancedConfiguration.property.TypeEnum
          .boolean:
          val = val === 'true';
          break;
        case database.capabilities.advancedConfiguration.property.TypeEnum
          .double:
        case database.capabilities.advancedConfiguration.property.TypeEnum.long:
          val = +val;
          break;
        case database.capabilities.advancedConfiguration.property.TypeEnum
          .string:
        default:
          break;
      }
      values[sanitizePropertyName(property.name)] = val;
    });
    return values;
  };

  const [properties, setProperties] = useState<AdvancedConfigurationProperty[]>(
    getInitialProperties(),
  );

  const generateSchemaForProperty = (
    property: AdvancedConfigurationProperty,
  ) => {
    switch (property.type) {
      case database.capabilities.advancedConfiguration.property.TypeEnum
        .boolean:
        return z.coerce.boolean();
      case database.capabilities.advancedConfiguration.property.TypeEnum.double:
      case database.capabilities.advancedConfiguration.property.TypeEnum.long: {
        let numericSchema = z.coerce.number();
        if (property.minimum !== undefined && property.minimum !== null) {
          numericSchema = numericSchema.min(
            property.minimum,
            t('advancedConfigurationErrorMin', { min: property.minimum }),
          );
        }
        if (property.maximum !== undefined && property.maximum !== null) {
          numericSchema = numericSchema.max(
            property.maximum,
            t('advancedConfigurationErrorMax', { max: property.maximum }),
          );
        }
        return numericSchema;
      }
      case database.capabilities.advancedConfiguration.property.TypeEnum.string:
        return property.values
          ? z.enum(property.values as [string, ...string[]])
          : z.string();
      default:
        return z.string();
    }
  };
  const generateDynamiSchema = (
    schemaProperties: AdvancedConfigurationProperty[],
  ) => {
    const schemaObject: {
      [key: string]:
        | z.ZodNumber
        | z.ZodString
        | z.ZodBoolean
        | z.ZodEnum<[string, ...string[]]>;
    } = {};
    schemaProperties.forEach((property) => {
      schemaObject[
        sanitizePropertyName(property.name)
      ] = generateSchemaForProperty(property);
    });
    return z.object(schemaObject).strict();
  };

  const schema = generateDynamiSchema(properties);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(properties),
  });

  const availableProperties = capabilities.filter(
    (c) => !properties.find((p) => p.name === c.name),
  );
  const addProperty = (
    property: database.capabilities.advancedConfiguration.Property,
  ) => {
    let defaultValue: string | number | boolean = '';
    switch (property.type) {
      case database.capabilities.advancedConfiguration.property.TypeEnum
        .boolean:
        defaultValue = true;
        break;
      case database.capabilities.advancedConfiguration.property.TypeEnum.double:
      case database.capabilities.advancedConfiguration.property.TypeEnum.long:
        defaultValue = 0;
        break;
      case database.capabilities.advancedConfiguration.property.TypeEnum.string:
      default:
        break;
    }
    const advancedProp: AdvancedConfigurationProperty = {
      ...property,
      isDeletable: true,
      defaultValue,
    };
    form.register(sanitizePropertyName(property.name), {
      value: defaultValue,
    });
    setProperties((prevValue) => [...prevValue, advancedProp]);
  };
  const removeProperty = (
    property: database.capabilities.advancedConfiguration.Property,
  ) => {
    form.unregister(sanitizePropertyName(property.name));
    setProperties((prevValue) =>
      prevValue.filter((p) => p.name !== property.name),
    );
  };
  const reset = () => {
    setProperties(getInitialProperties());
    form.reset();
  };
  const formValues = form.watch();
  const payload = useMemo(() => {
    const p: Record<string, string> = {};
    if (!formValues) return p;
    Object.keys(formValues).forEach((key) => {
      p[key.replace(':', '.')] = `${formValues[key]}`;
    });
    return p;
  }, [formValues]);

  return {
    form,
    lists: {
      properties,
      availableProperties,
    },
    methods: {
      sanitizePropertyName,
      addProperty,
      removeProperty,
      reset,
    },
    result: {
      payload,
    },
  };
};
