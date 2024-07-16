import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { TWorkflowScheduling } from '@/pages/new/hooks/useWorkflowStepper';
import CronValidator from '@/pages/new/utils/cron-validator';
import { PciNumberInput } from './PciNumberInput.component';
import { CronHelper } from './CronHelper.component';
import { MonthHelper } from './MonthHelper.component';
import { DowHelper } from './DowHelper.component';

export interface CronInputProps {
  scheduling: TWorkflowScheduling;
  onInput: (scheduling: TWorkflowScheduling) => void;
}

export function CronInput({ scheduling, onInput }: Readonly<CronInputProps>) {
  const { t } = useTranslation('workflow-add');
  const [state, setState] = useState(scheduling);
  const [errors, setErrors] = useState({
    minutes: false,
    hour: false,
    dom: false,
    month: false,
    dow: false,
  });
  const validator = useRef(new CronValidator()).current;

  useEffect(() => {
    const err = {
      minutes: !validator.validateMinutes(state.minutes),
      hour: !validator.validateHours(state.hour),
      dom: !validator.validateDays(state.dom),
      month: !validator.validateMonths(state.month, true),
      dow: !validator.validateWeekdays(state.dow, true),
    };
    setErrors(err);
    const hasError = Object.values(err).some((v) => v);
    onInput(hasError ? null : state);
  }, [state, setErrors, onInput]);

  return (
    <>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        <span className="font-bold">{t('pci_workflow_create_cron_title')}</span>{' '}
        ({t('pci_workflow_create_cron_timezone')})
        <CronHelper />
      </OsdsText>

      <div className="flex gap-5">
        {['minutes', 'hour', 'dom', 'month', 'dow'].map((field) => (
          <OsdsFormField key={field} inline>
            <OsdsText
              slot="helper"
              color={ODS_THEME_COLOR_INTENT[errors[field] ? 'error' : 'text']}
              className="mt-4"
            >
              {t(`pci_workflow_create_cron_${field}`)}
              {field === 'month' && <MonthHelper />}
              {field === 'dow' && <DowHelper />}
            </OsdsText>
            <OsdsInput
              value={state[field]}
              inline
              color={
                ODS_THEME_COLOR_INTENT[errors[field] ? 'error' : 'primary']
              }
              error={errors[field]}
              onOdsValueChange={(e) => {
                setState((s) => ({
                  ...s,
                  [field]: e.detail.value,
                }));
              }}
              type={ODS_INPUT_TYPE.text}
              className="border"
            />
          </OsdsFormField>
        ))}
      </div>

      <div className="mt-10">
        <PciNumberInput
          value={state.rotation}
          onChange={(rotation) =>
            setState((s) => ({
              ...s,
              rotation,
            }))
          }
          label={t('pci_workflow_create_rotate')}
          description={t('pci_workflow_create_rotate_description')}
          minValue={1}
        />
      </div>

      <div className="mt-8">
        <PciNumberInput
          value={state.maxExecutionCount}
          onChange={(maxExecutionCount) =>
            setState((s) => ({
              ...s,
              maxExecutionCount,
            }))
          }
          label={t('pci_workflow_create_execution_count')}
          description={t('pci_workflow_create_execution_count_description')}
        />
      </div>
    </>
  );
}
