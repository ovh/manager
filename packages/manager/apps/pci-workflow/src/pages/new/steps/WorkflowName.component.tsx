import {
  OsdsButton,
  OsdsText,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_INPUT_TYPE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useCatalogPrice, useMe } from '@ovhcloud/manager-components';
import { useParams } from 'react-router-dom';
import { useInstanceSnapshotPricing } from '@/api/hooks/order';
import { StepState } from '@/pages/new/hooks/useStep';

interface WorkflowNameProps {
  name: string;
  region: string;
  step: StepState;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const VALID_NAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;

export function WorkflowName({
  name,
  region,
  step,
  onNameChange,
  onSubmit,
  onCancel,
}: Readonly<WorkflowNameProps>) {
  const { t } = useTranslation('workflow-add');
  const { t: tCommon } = useTranslation('common');
  const { projectId } = useParams();
  const [workflowName, setWorkflowName] = useState(name);
  const [hasError, setHasError] = useState(false);
  const isValid = VALID_NAME_PATTERN.test(workflowName);
  const { me } = useMe();
  const { getFormattedCatalogPrice } = useCatalogPrice(2, {
    hideTaxLabel: true,
  });
  const { data: pricing, isPending } = useInstanceSnapshotPricing(
    projectId,
    region,
    me?.ovhSubsidiary,
  );

  if (isPending) {
    return (
      <OsdsSpinner
        inline
        size={ODS_SPINNER_SIZE.md}
        data-testid="loading-spinner"
      />
    );
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
          {hasError && (
            <span className="block">
              {tCommon('common_field_error_pattern')}
            </span>
          )}
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
                price: getFormattedCatalogPrice(pricing.price),
              })}
            </span>
          )}
          {!pricing && (
            <span className="font-bold">
              {t('pci_workflow_create_price_not_available')}{' '}
            </span>
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
            {tCommon('common_stepper_next_button_label')}
          </OsdsButton>
          <OsdsButton
            className="mt-6 w-fit"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={onCancel}
          >
            {tCommon('common_stepper_cancel_button_label')}
          </OsdsButton>
        </div>
      )}
    </>
  );
}
