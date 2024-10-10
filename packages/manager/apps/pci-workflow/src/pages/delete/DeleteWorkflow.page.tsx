import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal, useInstance } from '@ovh-ux/manager-pci-common';
import { useDeleteWorkflow, useWorkflows } from '@/api/hooks/workflows';

export default function DeleteWorkflowPage() {
  const { t: tDelete } = useTranslation('delete');
  const { t } = useTranslation('listing');
  const { t: tCommon } = useTranslation('pci-common');
  const { projectId, workflowId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { addError, addSuccess } = useNotifications();
  const { data: workflows, isPending: isPendingWorkflows } = useWorkflows(
    projectId,
  );

  const workflow = workflows.find((w) => w.id === workflowId);
  const { data: instance } = useInstance(projectId, workflow?.instanceId);
  const { deleteWorkflow, isPending } = useDeleteWorkflow({
    projectId,
    workflowId,
    region: instance?.region,
    onError(error: ApiError) {
      addError(
        <Translation ns="delete">
          {(_t) =>
            _t('pci_workflow_delete_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="delete">
          {(_t) =>
            _t('pci_workflow_delete_success', {
              workflowName: workflow?.name,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });
  const [formState, setFormState] = useState({
    inputDelete: '',
    hasError: false,
    isTouched: false,
  });

  useEffect(() => {
    setFormState({
      ...formState,
      hasError: formState.isTouched && formState.inputDelete !== 'DELETE',
    });
  }, [formState.inputDelete, formState.isTouched]);

  return (
    <DeletionModal
      title={t('pci_workflow_delete_title')}
      confirmationText="DELETE"
      confirmationLabel={tDelete('pci_workflow_delete_enter')}
      inputErrorMessage={tCommon('common_field_error_pattern')}
      isPending={isPending || isPendingWorkflows}
      onConfirm={deleteWorkflow}
      onCancel={onClose}
      onClose={onClose}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {tDelete('pci_workflow_delete_confirmation', {
          workflowName: workflow?.name,
        })}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="mt-6 block"
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {tDelete('pci_workflow_delete_warning')}
      </OsdsText>
    </DeletionModal>
  );
}
