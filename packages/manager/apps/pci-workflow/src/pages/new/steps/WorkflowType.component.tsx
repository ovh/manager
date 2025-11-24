import { useTranslation } from 'react-i18next';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

import { WorkflowType } from '@/api/hooks/workflows';
import { PciTile } from '@/pages/new/components/PciTile.component';
import { StepState } from '@/pages/new/hooks/useStep';
import { TWorkflowCreationForm } from '@/pages/new/hooks/useWorkflowStepper';

interface WorkflowTypeProps {
  step: StepState;
  selectedWorkflowType: TWorkflowCreationForm['type'];
  onChange: (workflowType: TWorkflowCreationForm['type']) => void;
  onSubmit: () => void;
}

export function WorkflowTypeSelector({
  step,
  selectedWorkflowType,
  onChange,
  onSubmit,
}: Readonly<WorkflowTypeProps>) {
  const { t } = useTranslation('workflow-add');
  const { t: tListing } = useTranslation('listing');
  const { t: tCommon } = useTranslation('pci-common');
  return (
    <>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_workflow_create_type_description')}
      </OsdsText>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
        {Object.values(WorkflowType).map((type) => {
          return (
            <PciTile
              key={type}
              title={tListing(`pci_workflow_type_${type}_title`)}
              isChecked={type === selectedWorkflowType}
              description={t(`pci_workflow_create_type_${type}_description`)}
              onClick={() => onChange(type)}
            />
          );
        })}
      </div>
      {!step.isLocked && (
        <OsdsButton
          className="w-fit mt-6"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(selectedWorkflowType ? {} : { disabled: true })}
          onClick={onSubmit}
        >
          {tCommon('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
