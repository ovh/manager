import { FormField, Select, Input, Text, FormFieldLabel, SelectContent, SelectControl, FormFieldError } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMemo, forwardRef, useImperativeHandle } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ContactMean,
  ContactMeanType,
  CreateContactMean,
} from '@/data/types/contact-mean.type';

type ContactFormProps = {
  contactMean?: ContactMean;
  onSubmit: SubmitHandler<CreateContactMean>;
};

const schema = z.object({
  type: z.nativeEnum(ContactMeanType, {
    required_error: 'error_required_field',
  }),
  email: z
    .string({ required_error: 'error_required_field', message: 'error_email' })
    .email({ message: 'error_email' }),
  description: z
    .string()
    .nullable()
    .transform((value) => (value === undefined || value === '' ? null : value)),
});

const ContactForm = forwardRef(
  ({ contactMean, onSubmit }: ContactFormProps, ref) => {
    const { t } = useTranslation(['contacts', NAMESPACES.FORM]);
    const defaultValues = useMemo(() => {
      if (contactMean === undefined) {
        return {
          type: ContactMeanType.EMAIL,
          description: null,
        };
      }

      switch (contactMean.type) {
        case ContactMeanType.EMAIL:
          return {
            type: ContactMeanType.EMAIL,
            email: contactMean.email || '',
            description: contactMean.description,
          };
        default:
          return {
            type: ContactMeanType.EMAIL,
            description: null,
          };
      }
    }, [contactMean]);

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateContactMean>({
      defaultValues,
      resolver: zodResolver(schema),
    });

    useImperativeHandle(ref, () => ({
      submit: handleSubmit(onSubmit),
    }));

    return (
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <FormField invalid={!!errors.type}>
              <FormFieldLabel htmlFor={name}>
                {t('contact_form_type_label')}*
              </FormFieldLabel>
              <Select
                name={name}
                defaultValue={ContactMeanType.EMAIL}
                value={[value]}
                disabled={!!contactMean}
                onBlur={onBlur}
                onValueChange={onChange}
                invalid={!!errors.type}
                required
                items={Object.values(ContactMeanType).map((type) => ({
                  value: type,
                  label: t(`type_${type.toLowerCase()}`),
                }))}
              >
                <SelectControl />
                <SelectContent />
              </Select>
              {errors.type && (
                <FormFieldError>
                  {t(errors.type.message || 'error_required_field', {
                    ns: NAMESPACES.FORM,
                  })}
                </FormFieldError>
              )}
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <FormField invalid={!!errors.email}>
              <FormFieldLabel htmlFor={name}>
                {t('contact_form_type_email_label')}*
              </FormFieldLabel>
              <Input
                name={name}
                defaultValue={value}
                onChange={onChange}
                disabled={!!contactMean}
                onBlur={onBlur}
                invalid={!!errors.email}
                required
              />
              {errors.email && (
                <FormFieldError>
                  {t(errors.email.message || 'error_required_field', {
                    ns: NAMESPACES.FORM,
                  })}
                </FormFieldError>
              )}
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <FormField invalid={!!errors.description}>
              <FormFieldLabel htmlFor={name}>
                {t('contact_form_name_label')}
              </FormFieldLabel>
              <Input
                name={name}
                value={value ?? undefined}
                onChange={onChange}
                onBlur={onBlur}
                invalid={!!errors.description}
              />
              {errors.description && (
                <FormFieldError>
                  {t(errors.description.message || 'error_pattern', {
                    ns: NAMESPACES.FORM,
                  })}
                </FormFieldError>
              )}
            </FormField>
          )}
        />
      </form>
    );
  },
);

export default ContactForm;
