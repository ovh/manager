import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StepState } from '@/pages/new/hooks/useStep';
import ResourceSelectorComponent from '@/components/new/ResourceSelector.component';
import { TInstance } from '@/type';
import { PciTile } from '../components/PciTile.component';

interface WorkflowResourceProps {
  step: StepState;
  onSubmit: (instance: TInstance) => void;
}

export function WorkflowResource({
  onSubmit,
  step,
}: Readonly<WorkflowResourceProps>) {
  const { t } = useTranslation('common');
  const [instance, setInstance] = useState<TInstance>(null);
  return (
    <>
      {step.isLocked && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-8">
          <PciTile title={instance.id} isChecked />
        </div>
      )}
      {!step.isLocked && (
        <ResourceSelectorComponent onSelectInstance={setInstance} />
      )}
      {!step.isLocked && (
        <OsdsButton
          className="w-fit mt-6"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(instance ? {} : { disabled: true })}
          onClick={() => instance && onSubmit(instance)}
        >
          {t('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
