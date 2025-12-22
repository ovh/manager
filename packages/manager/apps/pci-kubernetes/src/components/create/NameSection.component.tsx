import { FieldValue, FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldHelper, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';

type TNameSectionProps<FormSchema extends FieldValues> = {
  fieldName: Path<FormSchema>;
  helperEntries: Array<string>;
};

export const NameSection = <FormSchema extends FieldValues>({
  fieldName,
  helperEntries,
}: TNameSectionProps<FormSchema>) => {
  const { t } = useTranslation('add');

  const {
    register,
    formState: {
      errors: { [fieldName]: fieldError },
    },
  } = useFormContext<FormSchema>();

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_name')}
      </Text>
      <FormField invalid={!!fieldError}>
        <FormFieldLabel>{t('kubernetes_add_name_input_label')}</FormFieldLabel>
        <Input {...register(fieldName)} className="sm:w-1/2" invalid={!!fieldError} />
        <FormFieldHelper className="flex flex-col">
          {helperEntries.map((entry, index) => (
            <Text preset="caption" key={index}>
              {entry}
            </Text>
          ))}
        </FormFieldHelper>
      </FormField>
    </>
  );
};
