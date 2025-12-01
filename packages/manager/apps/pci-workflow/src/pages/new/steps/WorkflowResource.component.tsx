import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, Button, Spinner } from '@ovhcloud/ods-react';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { TWorkflowSelectedResource, WorkflowType } from '@/api/hooks/workflows';
import { InstanceSelectorComponent } from '@/components/new/InstanceSelectorComponent';
import { StepState } from '@/pages/new/hooks/useStep';
import { TWorkflowCreationForm } from '@/pages/new/hooks/useWorkflowStepper';

import { PciTile } from '../components/PciTile.component';

interface WorkflowResourceProps {
  step: StepState;
  selectedWorkflowType: TWorkflowCreationForm['type'];
  selectedResource: TWorkflowSelectedResource | null;
  onUpdate: (newSelectedResource: TWorkflowSelectedResource) => void;
  onSubmit: () => void;
}

export function WorkflowResource({
  selectedWorkflowType,
  step,
  selectedResource,
  onUpdate,
  onSubmit,
}: Readonly<WorkflowResourceProps>) {
  const { t } = useTranslation('pci-common');

  const handleSelectedInstance = (instance: TInstance) => {
    onUpdate({ ...instance.id, label: instance.label });
  };

  return (
    <div className="flex flex-col gap-8">
      {step.isLocked && !selectedResource && (
        <div className="text-center">
          <Spinner size={'md'} />
        </div>
      )}
      {step.isLocked && !!selectedResource && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <PciTile title={selectedResource.label} isChecked />
        </div>
      )}
      {!step.isLocked && selectedWorkflowType === WorkflowType.INSTANCE_BACKUP && (
        <InstanceSelectorComponent
          selectedInstance={selectedResource}
          onSelectInstance={handleSelectedInstance}
        />
      )}
      {!step.isLocked && (
        <Button
          className="w-fit p-6"
          size={BUTTON_SIZE.md}
          color={BUTTON_COLOR.primary}
          disabled={!selectedResource}
          onClick={onSubmit}
        >
          {t('common_stepper_next_button_label')}
        </Button>
      )}
    </div>
  );
}
