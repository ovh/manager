import { useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';

import type { SettingsFormValuesType } from '@/types/Settings.type';

export default function DashboardSettingsPage() {
  const { t } = useTranslation(['settings', 'common']);
  const { control, handleSubmit, formState } = useForm<SettingsFormValuesType>({
    defaultValues: { projectName: '', description: '' },
    mode: 'onTouched',
  });

  const onSubmit = useCallback(async (values: SettingsFormValuesType) => {
    await Promise.resolve();
    console.log('save', values);
  }, []);

  return (
    <form
      className="flex flex-col gap-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow"
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
    >
      <Controller
        name="projectName"
        control={control}
        rules={{
          required: {
            value: true,
            message: t('settings:errors.projectNameRequired'),
          },
        }}
        render={({ field, fieldState }) => (
          <OdsFormField className="w-full" error={fieldState.error?.message}>
            <label htmlFor="projectName" slot="label" className="text-sm font-medium text-gray-700">
              {t('settings:projectName')} *
            </label>
            <OdsInput
              id="projectName"
              name="projectName"
              value={field.value}
              hasError={!!fieldState.error}
              onOdsChange={(ev) => field.onChange(ev.detail.value)}
              onOdsBlur={field.onBlur}
            />
          </OdsFormField>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <OdsFormField className="w-full" error={fieldState.error?.message}>
            <label htmlFor="description" slot="label" className="text-sm font-medium text-gray-700">
              {t('settings:description')}
            </label>
            <OdsInput
              id="description"
              name="description"
              value={field.value}
              hasError={!!fieldState.error}
              onOdsChange={(ev) => field.onChange(ev.detail.value)}
              onOdsBlur={field.onBlur}
            />
          </OdsFormField>
        )}
      />
      <div className="flex justify-end">
        <OdsButton
          type="submit"
          label={t('settings:saveButton')}
          isDisabled={formState.isSubmitting}
        />
      </div>
    </form>
  );
}
