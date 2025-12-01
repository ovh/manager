import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { Spinner } from '@ovhcloud/ods-react';

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
    <>
      {step.isLocked && !selectedResource && (
        <div className="text-center">
          <Spinner size={'md'} />
        </div>
      )}
      {step.isLocked && !!selectedResource && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-8">
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
        <OsdsButton
          className="w-fit mt-6"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(selectedResource ? {} : { disabled: true })}
          onClick={onSubmit}
        >
          {t('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
