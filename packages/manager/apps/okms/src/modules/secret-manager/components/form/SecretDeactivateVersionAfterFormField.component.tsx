import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import {
  OdsText,
  OdsFormField,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';
import { HelpIconWithTooltip } from '@/components/helpIconWithTooltip/HelpIconWithTooltip.component';

type FormFieldInput = {
  deactivateVersionAfter: string;
};

export const SecretDeactivateVersionAfterFormField = <
  T extends FormFieldInput
>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation('secret-manager');
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <OdsFormField error={fieldState.error?.message}>
          <label htmlFor={field.name} slot="label" className="mb-1"></label>
          <label slot="label" className="flex items-center gap-2 relative mb-1">
            {t('deactivate_version_after')}
            <HelpIconWithTooltip
              label={t('form_tooltip_deactivate_version_after')}
            />
          </label>
          <OdsInput
            id={field.name}
            name={field.name}
            value={field.value.toString()}
            onOdsBlur={field.onBlur}
            onOdsChange={field.onChange}
            data-testid={SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER}
          />
          <OdsText slot="helper" preset="caption">
            {t('form_helper_deactivate_version_after')}
          </OdsText>
        </OdsFormField>
      )}
    />
  );
};
