import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Input,
} from '@ovhcloud/ods-react';
import { Text } from '@ovhcloud/ods-react';

import { HelpIconWithTooltip } from '@/common/components/help-icon-with-tooltip/HelpIconWithTooltip.component';

import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

export const SecretDeactivateVersionAfterFormField = <T extends FieldValues>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation('secret-manager');
  const { field, fieldState } = useController({ name, control });

  return (
    <FormField invalid={!!fieldState.error}>
      <FormFieldLabel className="flex items-center gap-2">
        {t('deactivate_version_after')}
        <HelpIconWithTooltip label={t('form_tooltip_deactivate_version_after')} />
      </FormFieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={field.onChange}
        data-testid={SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER}
        className="bg-white"
      />
      <FormFieldHelper>
        <Text preset="caption">{t('form_helper_deactivate_version_after')}</Text>
      </FormFieldHelper>
      {fieldState.error?.message && <FormFieldError>{fieldState.error?.message}</FormFieldError>}
    </FormField>
  );
};
