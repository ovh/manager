import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, Button, Text } from '@ovhcloud/ods-react';

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
  const { t } = useTranslation(['workflow-add', 'listing', 'pci-common']);
  return (
    <div className="flex flex-col gap-8">
      <Text>{t('workflow-add:pci_workflow_create_type_description')}</Text>
      <div className="flex flex-row gap-10 flex-wrap">
        {Object.values(WorkflowType).map((type) => {
          return (
            <PciTile
              key={type}
              title={t(`listing:pci_workflow_type_${type}_title`)}
              isChecked={type === selectedWorkflowType}
              description={t(`workflow-add:pci_workflow_create_type_${type}_description`)}
              onClick={() => onChange(type)}
              className="max-w-[33%]"
            />
          );
        })}
      </div>
      {!step.isLocked && (
        <Button
          className="w-fit p-6"
          size={BUTTON_SIZE.md}
          color={BUTTON_COLOR.primary}
          disabled={!selectedWorkflowType}
          onClick={onSubmit}
        >
          {t('pci-common:common_stepper_next_button_label')}
        </Button>
      )}
    </div>
  );
}
