/**
 * SettingsPage.tsx
 * -----------------------------------------------------------------------------
 * Form page for editing project settings.
 *
 * - Uses `react-hook-form` for form state and validation.
 * - Integrates with OVHcloud ODS components (`OdsFormField`, `OdsInput`, `OdsButton`).
 * - Provides i18n-based labels, placeholders, and validation error messages.
 *
 * Behavior:
 * - Validates required fields (e.g. `projectName`).
 * - On submit, simulates a save (currently logs values).
 * - Disables the submit button while submitting.
 *
 * Styling:
 * - Responsive layout with Tailwind utility classes.
 * - Centered form with max width, padding, rounded corners, and shadow.
 */
import { useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';

import type { SettingsFormValuesType } from '@/types/Settings.type';

/**
 * Settings page component.
 *
 * Renders a form with:
 * - **Project Name** (required, validated with i18n error message).
 * - **Description** (optional text field).
 * - **Save button** (disabled while submitting).
 *
 * @returns React component rendering a settings form.
 *
 * @example
 * ```tsx
 * import SettingsPage from '@/pages/SettingsPage';
 *
 * function App() {
 *   return (
 *     <main>
 *       <h1>Settings</h1>
 *       <SettingsPage />
 *     </main>
 *   );
 * }
 * ```
 */
export default function SettingsPage() {
  const { t } = useTranslation(['settings', 'common']);
  const { control, handleSubmit, formState } = useForm<SettingsFormValuesType>({
    defaultValues: { projectName: '', description: '' },
    mode: 'onTouched',
  });

  const onSubmit = useCallback(async (values: SettingsFormValuesType) => {
    // TODO: replace with API call
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
      {/* Project Name field */}
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

      {/* Description field */}
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

      {/* Save button */}
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
