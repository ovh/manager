import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import {
  OdsFormField,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';
import { HelpIconWithTooltip } from '@/components/helpIconWithTooltip/HelpIconWithTooltip.component';

type CasRequiredFormValue = 'active' | 'inactive';

type FormFieldInput = {
  casRequired: CasRequiredFormValue;
};

type SecretCasRequiredFormFieldProps<
  T extends FormFieldInput
> = UseControllerProps<T> & {
  isCasRequiredSetOnOkms?: boolean;
};

export const SecretCasRequiredFormField = <T extends FormFieldInput>({
  name,
  control,
  isCasRequiredSetOnOkms,
}: SecretCasRequiredFormFieldProps<T>) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <OdsFormField error={fieldState.error?.message}>
          <label slot="label" className="flex items-center gap-2 relative mb-1">
            <span>{t('cas_with_description')}</span>
            <HelpIconWithTooltip label={t('cas_with_description_tooltip')} />
          </label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <OdsRadio
                inputId={`${field.name}-active`}
                name={field.name}
                value="active"
                isChecked={field.value === 'active'}
                onOdsChange={field.onChange}
                data-testid={SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE}
              />
              <label htmlFor={`${field.name}-active`}>
                <OdsText preset="paragraph">{t('activated')}</OdsText>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <OdsRadio
                inputId={`${field.name}-inactive`}
                name={field.name}
                value="inactive"
                isChecked={field.value === 'inactive'}
                onOdsChange={field.onChange}
                data-testid={SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_INACTIVE}
              />
              <label htmlFor={`${field.name}-inactive`}>
                <OdsText preset="paragraph">
                  {t('disabled', { ns: NAMESPACES.STATUS })}
                </OdsText>
              </label>
            </div>
          </div>
          {isCasRequiredSetOnOkms && (
            <OdsText slot="helper" preset="caption">
              {t('form_helper_cas_required_okms')}
            </OdsText>
          )}
        </OdsFormField>
      )}
    />
  );
};

export const casRequiredToFormValue = (
  casRequired: boolean,
): CasRequiredFormValue => {
  return casRequired ? 'active' : 'inactive';
};

export const formValueToCasRequired = (
  formValue: CasRequiredFormValue,
): boolean => {
  return formValue === 'active';
};
