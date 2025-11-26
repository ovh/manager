import { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE, ODS_TEXT_SIZE, OdsInputValueChangeEvent } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';

type TNameStepProps = {
  name: {
    value: string;
    isTouched: boolean;
    hasError: boolean;
  };
  onNameChange: (e: OdsInputValueChangeEvent) => void;
};

export default function NameStep({ name, onNameChange }: TNameStepProps): ReactElement {
  const { t } = useTranslation(['common', 'add']);

  return (
    <OsdsFormField
      data-testid="name-field"
      className="mt-4"
      inline
      error={name.hasError ? t('add:kube_add_node_pool_name_input_pattern_validation_error') : ''}
    >
      <OsdsText
        slot="label"
        color={name.hasError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.text}
        className="mt-4"
        size={ODS_TEXT_SIZE._100}
      >
        {t('add:kubernetes_add_name')}
      </OsdsText>
      <div className="w-fit">
        <OsdsInput
          data-testid="name-input"
          value={name.value}
          inline
          color={name.hasError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.primary}
          onOdsValueChange={onNameChange}
          type={ODS_INPUT_TYPE.text}
          error={name.hasError}
          className="border"
        />
      </div>
    </OsdsFormField>
  );
}
