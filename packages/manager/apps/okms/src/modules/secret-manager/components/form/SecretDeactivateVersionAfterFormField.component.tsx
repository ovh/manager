import { UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { HelpIconWithTooltip } from '@/common/components/help-icon-with-tooltip/HelpIconWithTooltip.component';

import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

type FormFieldInput = {
  deactivateVersionAfter?: string;
};

export const SecretDeactivateVersionAfterFormField = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation('secret-manager');
  const { field, fieldState } = useController({ name, control });

  return (
    <OdsFormField error={fieldState.error?.message}>
      <label slot="label" className="relative mb-1 flex items-center gap-2">
        {t('deactivate_version_after')}
        <HelpIconWithTooltip label={t('form_tooltip_deactivate_version_after')} />
      </label>
      <OdsInput
        id={field.name}
        name={field.name}
        value={field.value?.toString()}
        onOdsBlur={field.onBlur}
        onOdsChange={field.onChange}
        data-testid={SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER}
      />
      <Text slot="helper" preset="caption">
        {t('form_helper_deactivate_version_after')}
      </Text>
    </OdsFormField>
  );
};
