import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsFormField, OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';

import { isClusterNameValid } from '@/helpers/matchers/matchers';

import { StepState } from '../hooks/useStep';

export interface ClusterNameStepProps {
  step: StepState;
  onNameChange: (name: string) => void;
  onSubmit: (name: string) => void;
}

export function ClusterNameStep({ onNameChange, onSubmit, step }: Readonly<ClusterNameStepProps>) {
  const { t } = useTranslation('add');
  const { t: tCommon } = useTranslation('common');
  const [name, setName] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const isValidName = isClusterNameValid(name);
  const hasError = isTouched && !isValidName;
  useEffect(() => {
    onNameChange(isValidName ? name : '');
  }, [name]);
  return !step.isLocked ? (
    <>
      <OsdsFormField
        class="mt-6"
        error={hasError ? t('kubernetes_add_cluster_name_input_pattern_validation_error') : ''}
        inline
      >
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={hasError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
        >
          {t('kubernetes_add_name')}
        </OsdsText>
        <div className="w-fit">
          <OsdsInput
            placeholder={t('kubernetes_add_name_placeholder')}
            value={name}
            color={hasError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.primary}
            type={ODS_INPUT_TYPE.text}
            onOdsValueChange={(e) => {
              setName(e.detail.value ?? '');
            }}
            onOdsInputBlur={() => setIsTouched(true)}
            error={hasError}
          />
        </div>
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
