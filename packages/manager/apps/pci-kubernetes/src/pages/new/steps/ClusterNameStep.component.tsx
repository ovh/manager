import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
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
import { StepState } from '../useStep';
import { NAME_INPUT_CONSTRAINTS } from '@/constants';

export interface ClusterNameStepProps {
  step: StepState;
  onNameChange: (name: string) => void;
  onSubmit: (name: string) => void;
}

export function ClusterNameStep({
  onNameChange,
  onSubmit,
  step,
}: Readonly<ClusterNameStepProps>) {
  const { t } = useTranslation('add');
  const { t: tCommon } = useTranslation('common');
  const [name, setName] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const isValidName =
    name?.length <= NAME_INPUT_CONSTRAINTS.MAX_LENGTH &&
    NAME_INPUT_CONSTRAINTS.PATTERN.test(name);
  const hasError = isTouched && !isValidName;
  useEffect(() => {
    onNameChange(isValidName ? name : '');
  }, [name]);
  return !step.isLocked ? (
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
          placeholder={t('kubernetes_add_name_placeholder')}
          value={name}
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(e) => {
            setName(e.detail.value ?? '');
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
        onClick={() => isValidName && onSubmit(name)}
      >
        {tCommon('common_stepper_next_button_label')}
      </OsdsButton>
    </>
  ) : (
    <OsdsText
      className="block w-[20rem]"
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._200}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {name}
    </OsdsText>
  );
}
