import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StepState } from '@/pages/new/hooks/useStep';
import { PciTile } from '@/pages/new/components/PciTile.component';

interface WorkflowTypeProps {
  step: StepState;
  onSubmit: (workflowType: string) => void;
}

export function WorkflowType({ step, onSubmit }: Readonly<WorkflowTypeProps>) {
  const { t } = useTranslation('workflow-add');
  const { t: tCommon } = useTranslation('common');
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
        <PciTile
          title={t('pci_workflow_create_type_title')}
          isChecked
          description={t(
            'pci_workflow_create_type_instance_backup_description',
          )}
        ></PciTile>
      </div>
      {!step.isLocked && (
        <OsdsButton
          className="w-fit mt-6"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit('instance_backup')}
        >
          {tCommon('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
