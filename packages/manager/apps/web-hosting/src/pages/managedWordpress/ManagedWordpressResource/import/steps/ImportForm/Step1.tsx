import { TFunction } from 'i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { ODS_BUTTON_COLOR, ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsPassword, OdsText } from '@ovhcloud/ods-components/react';

import { ManagerButton } from '@ovh-ux/manager-react-components';

export type Step1FormValues = {
  adminLogin?: string;
  adminPassword?: string;
  adminURL?: string;
};

type Step1Props = {
  t: TFunction;
  control: Control<Step1FormValues>;
  errors: FieldErrors<Step1FormValues>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function Step1({
  t,
  control,
  errors,
  isDirty,
  isValid,
  isSubmitting,
  onSubmit,
}: Step1Props) {
  return (
    <form onSubmit={onSubmit}>
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
        {t('common:web_hosting_common_url_connexion')}
      </OdsText>
      <Controller
        name="adminURL"
        control={control}
        render={({ field: { name, value, onBlur, onChange } }) => (
          <OdsFormField className="w-full mb-4" error={errors?.adminURL?.message}>
            <label slot="label">{t('common:web_hosting_common_admin_url')}*</label>
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              name={name}
              value={value}
              data-testid="input-admin-url"
              hasError={!!errors.adminURL}
              onOdsBlur={onBlur}
              onOdsChange={onChange}
              isClearable
            />
          </OdsFormField>
        )}
      />
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
        {t('common:web_hosting_common_wordpress_login')}
      </OdsText>
      <Controller
        name="adminLogin"
        control={control}
        render={({ field: { name, value, onBlur, onChange } }) => (
          <OdsFormField className="w-full mb-4" error={errors?.adminLogin?.message}>
            <label slot="label">{t('common:web_hosting_common_admin_login')}*</label>
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              name={name}
              value={value}
              data-testid="input-admin-login"
              hasError={!!errors.adminLogin}
              onOdsBlur={onBlur}
              onOdsChange={onChange}
              isClearable
            />
          </OdsFormField>
        )}
      />
      <Controller
        name="adminPassword"
        control={control}
        render={({ field: { name, value, onBlur, onChange } }) => (
          <OdsFormField className="w-full mb-4" error={errors?.adminPassword?.message}>
            <label slot="label">{t('common:web_hosting_common_admin_password')}*</label>
            <OdsPassword
              name={name}
              value={value}
              data-testid="input-admin-password"
              hasError={!!errors?.adminPassword}
              onOdsBlur={onBlur}
              onOdsChange={onChange}
              className="w-full"
              isClearable
              isMasked
            />
          </OdsFormField>
        )}
      />
      <OdsFormField>
        <ManagerButton
          type="submit"
          label={t('common:web_hosting_common_action_continue')}
          isDisabled={!isDirty || !isValid || isSubmitting}
          isLoading={isSubmitting}
          color={ODS_BUTTON_COLOR.primary}
          id="import-step1"
          data-testid="import-step1"
        />
      </OdsFormField>
    </form>
  );
}
