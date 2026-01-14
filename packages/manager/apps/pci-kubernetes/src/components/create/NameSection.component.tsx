import { FieldError, FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  Text,
} from '@ovhcloud/ods-react';

import { getErrorMessage } from '@/helpers';

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
    formState: { errors },
  } = useFormContext<FormSchema>();

  const fieldError = errors[fieldName] as FieldError | undefined;
  const fieldErrorMessage = fieldError ? getErrorMessage(fieldError) : undefined;

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_name')}
      </Text>
      <FormField invalid={!!fieldError}>
        <FormFieldLabel>{t('kubernetes_add_name_placeholder')}</FormFieldLabel>
        <Input {...register(fieldName)} className="sm:w-1/2" invalid={!!fieldError} />
        <FormFieldError>{fieldErrorMessage ? t(fieldErrorMessage) : ''}</FormFieldError>
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
