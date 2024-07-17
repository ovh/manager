import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import { useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeleteWorkflow, useWorkflows } from '@/api/hooks/workflows';
import { useInstance } from '@/api/hooks/instance';

export default function DeleteWorkflowPage() {
  const { t: tDelete } = useTranslation('delete');
  const { t } = useTranslation('listing');
  const { t: tGlobal } = useTranslation('global');
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

  const handleInputDeleteChange = (event: OdsInputValueChangeEvent) => {
    setFormState({
      ...formState,
      inputDelete: event.detail.value,
    });
  };

  return (
    <OsdsModal
      headline={t('pci_workflow_delete_title')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending || isPendingWorkflows ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="deleteWorkflow-spinner"
          />
        ) : (
          <div className="mt-4">
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
            <OsdsFormField
              className="mt-6"
              error={
                formState.hasError ? tGlobal('common_field_error_required') : ''
              }
            >
              <div slot="label">
                <OsdsText
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                  color={
                    formState.hasError
                      ? ODS_TEXT_COLOR_INTENT.error
                      : ODS_THEME_COLOR_INTENT.text
                  }
                >
                  {tDelete('pci_workflow_delete_enter')}
                </OsdsText>
              </div>
              <OsdsInput
                value={formState.inputDelete}
                type={ODS_INPUT_TYPE.text}
                onOdsValueChange={handleInputDeleteChange}
                data-testid="deleteWorkflow-input_delete"
                className={
                  formState.hasError
                    ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                    : 'border-color-[var(--ods-color-default-200)] bg-white'
                }
                onOdsInputBlur={() => {
                  setFormState({
                    ...formState,
                    isTouched: true,
                  });
                }}
              />
            </OsdsFormField>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => onClose()}
        data-testid="deleteWorkflow-button_cancel"
      >
        {tDelete('pci_workflow_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={deleteWorkflow}
        {...((formState.inputDelete !== 'DELETE' ||
          isPending ||
          isPendingWorkflows) && {
          disabled: true,
        })}
        data-testid="deleteWorkflow-button_submit"
      >
        {tDelete('pci_workflow_common_delete')}
      </OsdsButton>
    </OsdsModal>
  );
}
