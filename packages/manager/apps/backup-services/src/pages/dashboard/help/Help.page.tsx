import { useCallback, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';

import { HelpFormValues } from '@/types/Help.type';

export default function HelpPage() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { control, handleSubmit, formState } = useForm<HelpFormValues>({
    defaultValues: { email: '', subject: '', message: '' },
    mode: 'onTouched',
  });

  const [showNotification, setShowNotification] = useState(false);

  const onSubmit = useCallback((values: HelpFormValues) => {
    // replace with API call
    // await Promise.resolve();
    console.log('help form submitted', values);

    setShowNotification(true);
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      {showNotification && (
        <OdsMessage
          color="success"
          isDismissible
          onOdsRemove={() => {
            setShowNotification(false);
          }}
        >
          <OdsText>{t('dashboard:successMessage')}</OdsText>
        </OdsMessage>
      )}

      <form
        className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        {/* Email field */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('dashboard:errors.emailRequired'),
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('dashboard:errors.emailInvalid'),
            },
          }}
          render={({ field, fieldState }) => (
            <OdsFormField className="w-full" error={fieldState.error?.message}>
              <label
                htmlFor="email"
                slot="label"
                className="text-sm font-medium text-gray-700"
              >
                {t('dashboard:email')} *
              </label>
              <OdsInput
                id="email"
                name="email"
                value={field.value}
                onOdsChange={(ev) => field.onChange(ev.detail.value)}
                onOdsBlur={field.onBlur}
              />
            </OdsFormField>
          )}
        />

        {/* Subject field */}
        <Controller
          name="subject"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('dashboard:errors.subjectRequired'),
            },
          }}
          render={({ field, fieldState }) => (
            <OdsFormField className="w-full" error={fieldState.error?.message}>
              <label
                htmlFor="subject"
                slot="label"
                className="text-sm font-medium text-gray-700"
              >
                {t('dashboard:subject')} *
              </label>
              <OdsInput
                id="subject"
                name="subject"
                value={field.value}
                onOdsChange={(ev) => field.onChange(ev.detail.value)}
                onOdsBlur={field.onBlur}
              />
            </OdsFormField>
          )}
        />

        {/* Message textarea */}
        <Controller
          name="message"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('dashboard:errors.messageRequired'),
            },
          }}
          render={({ field, fieldState }) => (
            <OdsFormField className="w-full" error={fieldState.error?.message}>
              <label
                htmlFor="message"
                slot="label"
                className="text-sm font-medium text-gray-700"
              >
                {t('dashboard:message')} *
              </label>
              <OdsTextarea
                id="message"
                name="message"
                value={field.value}
                onOdsChange={(ev) => field.onChange(ev.detail.value)}
                onOdsBlur={field.onBlur}
              />
            </OdsFormField>
          )}
        />

        {/* Submit button */}
        <div className="flex justify-end">
          <OdsButton
            type="submit"
            label={t('dashboard:submitButton')}
            isDisabled={formState.isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
