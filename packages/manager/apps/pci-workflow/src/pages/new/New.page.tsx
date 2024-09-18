import {
  Headers,
  StepComponent,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OsdsBreadcrumb,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useWorkflowStepper } from './hooks/useWorkflowStepper';
import { WorkflowType } from './steps/WorkflowType.component';
import {
  getCron,
  WorkflowScheduling,
} from './steps/WorkflowScheduling.component';
import { WorkflowName } from './steps/WorkflowName.component';
import { WorkflowResource } from './steps/WorkflowResource.component';
import { useAddWorkflow } from '@/api/hooks/workflows';

export default function NewPage() {
  const { t } = useTranslation('workflow-add');
  const { t: tCommon } = useTranslation('common');
  const { t: tListing } = useTranslation('listing');
  const stepper = useWorkflowStepper();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const navigate = useNavigate();

  const { addWorkflow, isPending: isAdding } = useAddWorkflow({
    projectId,
    region: stepper.form.instance?.region,
    type: {
      cron: getCron(stepper.form.scheduling),
      instanceId: stepper.form.instance?.id,
      name: stepper.form.name,
      rotation: stepper.form.scheduling?.rotation,
      maxExecutionCount: stepper.form.scheduling?.maxExecutionCount,
    },
    onError: (err: ApiError) => {
      navigate('..');
      addError(
        <Translation ns="workflow-add">
          {(tr) =>
            tr('pci_workflow_add_error', {
              message: err?.response?.data?.message || err?.message || null,
            })
          }
        </Translation>,
        true,
      );
    },
    onSuccess: () => {
      navigate('..');
      addSuccess(
        <Translation ns="workflow-add">
          {(tr) =>
            tr('pci_workflow_add_success', {
              workflowName: stepper.form.name,
            })
          }
        </Translation>,
        true,
      );
    },
  });

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          className="mb-8"
          onClick={() => clearNotifications()}
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: backHref,
              label: tListing('pci_workflow_title'),
            },
            {
              label: tListing('pci_workflow_add'),
            },
          ]}
        />
      )}
      <Headers title={tListing('pci_workflow_add')} />
      <StepComponent
        order={1}
        {...stepper.type.step}
        isLocked={stepper.type.step.isLocked}
        title={t('pci_workflow_create_type_title')}
        edit={{
          action: stepper.type.edit,
          label: tCommon('common_stepper_modify_this_step'),
          isDisabled: stepper.naming.step.isLocked,
        }}
      >
        <WorkflowType step={stepper.type.step} onSubmit={stepper.type.submit} />
      </StepComponent>
      <div className="mt-8">
        <StepComponent
          order={2}
          {...stepper.resource.step}
          isLocked={stepper.resource.step.isLocked}
          title={t('pci_workflow_create_resources_title')}
          edit={{
            action: stepper.resource.edit,
            label: tCommon('common_stepper_modify_this_step'),
            isDisabled: stepper.naming.step.isLocked,
          }}
        >
          <WorkflowResource
            step={stepper.resource.step}
            onSubmit={stepper.resource.submit}
          />
        </StepComponent>
      </div>
      <div className="mt-8">
        <StepComponent
          order={3}
          {...stepper.scheduling.step}
          isLocked={stepper.scheduling.step.isLocked}
          title={t('pci_workflow_create_schedule_title')}
          edit={{
            action: stepper.scheduling.edit,
            label: tCommon('common_stepper_modify_this_step'),
            isDisabled: stepper.naming.step.isLocked,
          }}
        >
          <WorkflowScheduling
            step={stepper.scheduling.step}
            onSubmit={stepper.scheduling.submit}
          />
        </StepComponent>
      </div>
      <div className="mt-8">
        <StepComponent
          order={4}
          {...stepper.naming.step}
          isLocked={stepper.naming.step.isLocked}
          title={t('pci_workflow_create_general-info_title')}
        >
          <WorkflowName
            name={stepper.form.name}
            region={stepper.form.instance?.region}
            step={stepper.naming.step}
            onNameChange={stepper.naming.update}
            onSubmit={() => {
              stepper.naming.submit();
              addWorkflow();
            }}
            onCancel={() => {
              navigate('..');
            }}
          />
          {isAdding && (
            <div className="mt-5">
              <OsdsSpinner
                inline
                size={ODS_SPINNER_SIZE.md}
                className="align-middle"
              />
              <OsdsText
                className="ml-8"
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {t('pci_workflow_creating')}
              </OsdsText>
            </div>
          )}
        </StepComponent>
      </div>
    </>
  );
}
