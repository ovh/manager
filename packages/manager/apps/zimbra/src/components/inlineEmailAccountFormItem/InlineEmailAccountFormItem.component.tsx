import React from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsFormField, OdsInput, OdsPassword } from '@ovhcloud/ods-components/react';

import { GeneratePasswordButton } from '@/components';
import { AddEmailAccountsSchema } from '@/utils';

export const InlineEmailAccountFormItem = ({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) => {
  const { t } = useTranslation(['accounts/form', 'common']);
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<AddEmailAccountsSchema>();

  const domain = watch(`accounts.${index}.domain`);

  return (
    <div key={`account-${index}`} className="flex gap-4">
      <div className="w-full flex space-x-3">
        <Controller
          control={control}
          name={`accounts.${index}.firstName`}
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex-1" error={errors.accounts?.[index]?.firstName?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_firstName_label')} *
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_firstName_placeholder')}
                name={name}
                hasError={!!errors.accounts?.[index]?.firstName}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.lastName`}
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex-1" error={errors.accounts?.[index]?.lastName?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_lastName_label')} *
              </label>
              <OdsInput
                placeholder={t('zimbra_account_add_input_lastName_placeholder')}
                type={ODS_INPUT_TYPE.text}
                id={name}
                name={name}
                hasError={!!errors.accounts?.[index]?.lastName}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.account`}
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex-2" error={errors.accounts?.[index]?.account?.message}>
              <label htmlFor={name} slot="label">
                {t('common:email_account')} *
              </label>
              <div className="flex">
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  placeholder={t('common:account_name')}
                  data-testid="input-account"
                  id={name}
                  name={name}
                  hasError={!!errors.accounts?.[index]?.account}
                  value={value}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                />
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="@"
                  value={`@${domain}`}
                  isReadonly
                  isDisabled
                />
              </div>
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name={`accounts.${index}.password`}
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex-1" error={errors.accounts?.[index]?.password?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_password_label')} *
              </label>
              <div className="flex flex-1 gap-4 min-w-[240px]">
                <OdsPassword
                  data-testid="input-password"
                  isMasked
                  className="w-full"
                  id={name}
                  name={name}
                  hasError={!!errors.accounts?.[index]?.password}
                  value={value}
                  onOdsBlur={onBlur}
                  onOdsChange={(e) => {
                    // this is necessary because OdsPassword returns
                    // value as null somehow
                    onChange(e?.detail?.value || '');
                  }}
                />
                <GeneratePasswordButton
                  id={`generate-password-btn-${index}`}
                  onGenerate={(password) => {
                    setValue(`accounts.${index}.password`, password);
                  }}
                />
              </div>
            </OdsFormField>
          )}
        />
      </div>
      <OdsButton
        id={`delete-account-${index}`}
        data-testid={`delete-account-${index}`}
        className="[&::part(button)]:translate-y-1/2"
        type="button"
        onClick={onRemove}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.critical}
        icon={ODS_ICON_NAME.trash}
        label=""
      />
    </div>
  );
};

export default InlineEmailAccountFormItem;
