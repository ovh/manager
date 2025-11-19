import React from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  Password,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { GeneratePasswordButton } from '@/components';
import { AddEmailAccountsSchema } from '@/utils';

export const InlineEmailAccountFormItem = ({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) => {
  const { t } = useTranslation(['accounts/form', 'common', NAMESPACES.FORM]);
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<AddEmailAccountsSchema>();

  const domain = watch(`accounts.${index}.domain`);

  return (
    <div key={`account-${index}`} className="flex items-center gap-4">
      <div className="flex w-full space-x-3">
        <Controller
          control={control}
          name={`accounts.${index}.firstName`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="flex-1"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.firstName}
            >
              <FormFieldLabel>{t('zimbra_account_add_input_firstName_label')} *</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_firstName_placeholder')}
                name={name}
                invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.firstName}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors.accounts?.[index]?.firstName?.message && (
                <FormFieldError>{errors.accounts[index].firstName.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.lastName`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="flex-1"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.lastName}
            >
              <FormFieldLabel>{t('zimbra_account_add_input_lastName_label')} *</FormFieldLabel>
              <Input
                placeholder={t('zimbra_account_add_input_lastName_placeholder')}
                type={INPUT_TYPE.text}
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.lastName}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors.accounts?.[index]?.lastName?.message && (
                <FormFieldError>{errors.accounts[index].lastName.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.account`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="flex-2"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.account}
            >
              <FormFieldLabel>{t('common:email_account')} *</FormFieldLabel>
              <div className="flex">
                <Input
                  type={INPUT_TYPE.text}
                  placeholder={t('common:account_name')}
                  data-testid="input-account"
                  id={name}
                  name={name}
                  invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.account}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
                <Input type={INPUT_TYPE.text} name="@" value={`@${domain}`} readOnly disabled />
              </div>
              {(isDirty || isTouched) && errors.accounts?.[index]?.account?.message && (
                <FormFieldError>{errors.accounts[index].account.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.password`}
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="flex-1"
              invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.password}
            >
              <FormFieldLabel>{t('zimbra_account_add_input_password_label')} *</FormFieldLabel>
              <div className="flex min-w-[240px] flex-1 gap-4">
                <Password
                  data-testid="input-password"
                  className="w-full"
                  id={name}
                  name={name}
                  invalid={(isDirty || isTouched) && !!errors.accounts?.[index]?.password}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
                <GeneratePasswordButton
                  id={`generate-password-btn-${index}`}
                  onGenerate={(password) => {
                    setValue(`accounts.${index}.password`, password, { shouldValidate: true });
                  }}
                />
                <Button
                  id={`delete-account-${index}`}
                  data-testid={`delete-account-${index}`}
                  type="button"
                  onClick={onRemove}
                  size={BUTTON_SIZE.sm}
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.critical}
                >
                  <Icon name={ICON_NAME.trash} />
                </Button>
              </div>
              {(isDirty || isTouched) && errors.accounts?.[index]?.password?.message && (
                <FormFieldError>{errors.accounts[index].password.message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      </div>
    </div>
  );
};

export default InlineEmailAccountFormItem;
