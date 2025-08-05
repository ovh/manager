import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { Spinner } from '@ovhcloud/ods-react';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useInstance } from '@/api/hooks/instance/useInstances';
import ResourceSelectorComponent from '@/components/new/ResourceSelector.component';
import { useSafeParam } from '@/hooks/useSafeParam';
import { StepState } from '@/pages/new/hooks/useStep';

import { PciTile } from '../components/PciTile.component';

interface WorkflowResourceProps {
  step: StepState;
  onUpdate: (instance: TInstance) => void;
  instanceId: TInstance['id'] | null;
  onSubmit: () => void;
}

export function WorkflowResource({
  onSubmit,
  step,
  onUpdate,
  instanceId,
}: Readonly<WorkflowResourceProps>) {
  const { t } = useTranslation('pci-common');
  const projectId = useSafeParam('projectId');
  const { instance } = useInstance(projectId, instanceId);

  return (
    <>
      {step.isLocked && !instance && (
        <div className="text-center">
          <Spinner size={'md'} />
        </div>
      )}
      {step.isLocked && !!instance && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-8">
          <PciTile title={instance.label} isChecked />
        </div>
      )}
      {!step.isLocked && (
        <ResourceSelectorComponent selectedInstance={instance} onSelectInstance={onUpdate} />
      )}
      {!step.isLocked && (
        <OsdsButton
          className="w-fit mt-6"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(instanceId ? {} : { disabled: true })}
          onClick={onSubmit}
        >
          {t('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
