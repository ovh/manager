import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './contactValidateForm.scss';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ValidateContactMean } from '@/data/types/contact-mean.type';

type ContactValidateFormProps = {
  onSubmit: SubmitHandler<ValidateContactMean>;
};

const schema = z.object({
  otp: z.string({ required_error: 'error_required_field' }).refine(
    (v) => {
      if (v?.length !== 6) return false;
      const n = Number(v);
      return !Number.isNaN(n);
    },
    { message: 'error_pattern' },
  ),
});

const ContactValidateForm = forwardRef(
  ({ onSubmit }: ContactValidateFormProps, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ValidateContactMean>({
      resolver: zodResolver(schema),
    });
    const { t } = useTranslation(['contacts', NAMESPACES.FORM]);

    useImperativeHandle(ref, () => ({
      submit: handleSubmit(onSubmit),
    }));

    return (
      <form className="flex flex-col gap-4">
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value, onBlur, name } }) => (
            <OdsFormField>
              <label
                htmlFor={name}
                slot="label"
                aria-label={t('verify_contact_form_otp_label')}
              >
                {t('verify_contact_form_otp_label')}
              </label>
              <OdsInput
                name={name}
                value={value}
                onOdsChange={onChange}
                onBlur={onBlur}
                pattern="[0-9]{6}"
                hasError={!!errors.otp}
                maxlength={6}
                className="otp-input"
              />
              {errors.otp && (
                <OdsText className="text-error">
                  {t(errors.otp.message || 'error_required_field', {
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

export default ContactValidateForm;
