import {
  OdsFormField,
  OdsSelect,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
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
      <form className="flex flex-col gap-4">
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <OdsFormField>
              <label
                htmlFor={name}
                slot="label"
                aria-label={t('contact_form_type_label')}
              >
                {t('contact_form_type_label')}*
              </label>
              <OdsSelect
                name={name}
                defaultValue={ContactMeanType.EMAIL}
                value={value}
                isDisabled={!!contactMean}
                onBlur={onBlur}
                onOdsChange={onChange}
                hasError={!!errors.type}
                isRequired
              >
                {Object.values(ContactMeanType).map((type) => (
                  <option key={type} value={type}>
                    {t(`type_${type.toLowerCase()}`)}
                  </option>
                ))}
              </OdsSelect>
              {errors.type && (
                <OdsText className="text-error">
                  {t(errors.type.message || 'error_required_field', {
                    ns: NAMESPACES.FORM,
                  })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <OdsFormField>
              <label
                htmlFor={name}
                slot="label"
                aria-label={t('contact_form_type_email_label')}
              >
                {t('contact_form_type_email_label')}*
              </label>
              <OdsInput
                name={name}
                defaultValue={value}
                onOdsChange={onChange}
                isDisabled={!!contactMean}
                onBlur={onBlur}
                hasError={!!errors.email}
                isRequired
              />
              {errors.email && (
                <OdsText className="text-error">
                  {t(errors.email.message || 'error_required_field', {
                    ns: NAMESPACES.FORM,
                  })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <OdsFormField>
              <label
                htmlFor={name}
                slot="label"
                aria-label={t('contact_form_name_label')}
              >
                {t('contact_form_name_label')}
              </label>
              <OdsInput
                name={name}
                value={value}
                onOdsChange={onChange}
                onBlur={onBlur}
                hasError={!!errors.description}
              />
              {errors.description && (
                <OdsText className="text-error">
                  {t(errors.description.message || 'error_pattern', {
                    ns: NAMESPACES.FORM,
                  })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
      </form>
    );
  },
);

export default ContactForm;
