import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ClusterNameStepProps {
  initialName?: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

const MAX_LENGTH = 64;
const NAME_PATTERN = /^[a-zA-Z](([a-zA-Z0-9-]|_|-)*)[a-zA-Z0-9]$/;

export function ClusterNameStep({
  initialName,
  onNameChange,
  onSubmit,
}: Readonly<ClusterNameStepProps>) {
  const { t } = useTranslation('add');
  const { t: tCommon } = useTranslation('common');
  const [name, setName] = useState(initialName || '');
  const [isTouched, setIsTouched] = useState(false);
  const isValidName = name?.length <= MAX_LENGTH && NAME_PATTERN.test(name);
  const hasError = isTouched && !isValidName;
  useEffect(() => {
    onNameChange(isValidName ? name : '');
  }, [name]);
  return (
    <>
      <OsdsFormField
        class="mt-6"
        error={
          hasError
            ? t('kubernetes_add_cluster_name_input_pattern_validation_error')
            : ''
        }
        inline
      >
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
        >
          {t('kubernetes_add_name')}
        </OsdsText>
        <OsdsInput
          value={name}
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(e) => {
            setName(e.detail.value);
          }}
          onOdsInputBlur={() => setIsTouched(true)}
          error={hasError}
        />
      </OsdsFormField>
      <OsdsButton
        className="mt-8 w-fit"
        size={ODS_BUTTON_SIZE.md}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isValidName ? undefined : true}
        onClick={() => isValidName && onSubmit()}
      >
        {tCommon('common_stepper_submit_button_label')}
      </OsdsButton>
    </>
  );
}
