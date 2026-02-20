import { TFunction } from 'i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import {
  BUTTON_COLOR,
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  Password,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

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
    <form onSubmit={onSubmit} className="w-full">
      <h2 className="sr-only">{t('common:web_hosting_common_url_connexion')}</h2>
      <Text preset={TEXT_PRESET.heading3} className="mb-4">
        {t('common:web_hosting_common_url_connexion')}
      </Text>
      <Controller
        name="adminURL"
        control={control}
        render={({ field: { name, value, onBlur, onChange }, fieldState: { error, invalid } }) => (
          <FormField className="mb-4 w-full" id="input-admin-url" invalid={!!error && invalid}>
            <FormFieldLabel>{t('common:web_hosting_common_admin_url')}*</FormFieldLabel>
            <Input
              type={INPUT_TYPE.text}
              name={name}
              value={value}
              data-testid="input-admin-url"
              invalid={!!errors.adminURL}
              onBlur={onBlur}
              onChange={onChange}
              clearable
            />
            <FormFieldError>{errors?.adminURL?.message}</FormFieldError>
          </FormField>
        )}
      />
      <Text preset={TEXT_PRESET.heading3} className="mb-4">
        {t('common:web_hosting_common_wordpress_login')}
      </Text>
      <Controller
        name="adminLogin"
        control={control}
        render={({ field: { name, value, onBlur, onChange } }) => (
          <FormField
            className="mb-4 w-full"
            id="input-admin-login"
            aria-errormessage={errors?.adminLogin?.message}
          >
            <FormFieldLabel>{t('common:web_hosting_common_admin_login')}*</FormFieldLabel>
            <Input
              type={INPUT_TYPE.text}
              name={name}
              value={value}
              data-testid="input-admin-login"
              invalid={!!errors.adminLogin}
              onBlur={onBlur}
              onChange={onChange}
              clearable
            />
          </FormField>
        )}
      />
      <Controller
        name="adminPassword"
        control={control}
        render={({ field: { name, value, onBlur, onChange } }) => (
          <FormField
            className="mb-4 w-full"
            id="input-admin-password"
            aria-errormessage={errors?.adminPassword?.message}
          >
            <FormFieldLabel>{t('common:web_hosting_common_admin_password')}*</FormFieldLabel>
            <Password
              name={name}
              value={value}
              data-testid="input-admin-password"
              invalid={!!errors?.adminPassword}
              onBlur={onBlur}
              onChange={onChange}
              clearable
            />
          </FormField>
        )}
      />
      <FormField>
        <Button
          className="w-1/6"
          type="submit"
          disabled={!isDirty || !isValid || isSubmitting}
          loading={isSubmitting}
          color={BUTTON_COLOR.primary}
          id="import-step1"
          data-testid="import-step1"
        >
          {t('common:web_hosting_common_action_continue')}
        </Button>
      </FormField>
    </form>
  );
}
