import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_INPUT_TYPE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useInstanceSnapshotPricing } from '@/api/hooks/order';
import { StepState } from '@/pages/new/hooks/useStep';

interface WorkflowNameProps {
  name: string;
  instanceId: TInstance['id'];
  step: StepState;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

const VALID_NAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;

export function WorkflowName({
  name,
  instanceId,
  step,
  onNameChange,
  onSubmit,
}: Readonly<WorkflowNameProps>) {
  const { t } = useTranslation(['workflow-add', 'pci-common']);
  const { projectId } = useParams();
  const [workflowName, setWorkflowName] = useState(name);
  const [hasError, setHasError] = useState(false);
  const isValid = VALID_NAME_PATTERN.test(workflowName);

  const { getFormattedCatalogPrice } = useCatalogPrice(3, {
    hideTaxLabel: true,
  });
  const { pricing, isPending } = useInstanceSnapshotPricing(projectId, instanceId);

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} data-testid="loading-spinner" />;
  }

  return (
    <>
      <OsdsFormField inline>
        <OsdsText
          slot="label"
          color={ODS_THEME_COLOR_INTENT[hasError ? 'error' : 'text']}
          className="mt-4"
        >
          {t('pci_workflow_create_workflow_name')}
        </OsdsText>
        <OsdsText
          slot="helper"
          color={ODS_THEME_COLOR_INTENT[hasError ? 'error' : 'text']}
          className="mt-4"
        >
          {hasError && <span className="block">{t('pci-common:common_field_error_pattern')}</span>}
          {t('pci_workflow_create_name_help')}
        </OsdsText>
        <OsdsInput
          value={workflowName}
          inline
          color={ODS_THEME_COLOR_INTENT[hasError ? 'error' : 'primary']}
          error={false}
          onOdsInputBlur={() => {
            setHasError(!isValid);
          }}
          onOdsValueChange={(e) => {
            const valid = VALID_NAME_PATTERN.test(e.detail.value);
            setWorkflowName(e.detail.value);
            setHasError(!valid);
            onNameChange(valid ? e.detail.value : '');
          }}
          type={ODS_INPUT_TYPE.text}
          className="border"
        />
      </OsdsFormField>
      <div className="mt-5">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {t('pci_workflow_create_price_title')}{' '}
          {pricing && (
            <span className="font-bold">
              {t('pci_workflow_create_price_monthly', {
                price: getFormattedCatalogPrice(convertHourlyPriceToMonthly(pricing?.price)),
              })}
            </span>
          )}
          {!pricing && (
            <span className="font-bold">{t('pci_workflow_create_price_not_available')} </span>
          )}
        </OsdsText>
      </div>
      {!step.isLocked && (
        <div className="flex flex-row">
          <OsdsButton
            className="w-fit mt-6 mr-4"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => !hasError && onSubmit()}
            {...(isValid ? {} : { disabled: true })}
          >
            {t('pci-common:common_stepper_next_button_label')}
          </OsdsButton>
        </div>
      )}
    </>
  );
}
