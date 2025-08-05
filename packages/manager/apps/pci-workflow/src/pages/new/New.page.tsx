import { useHref, useNavigate } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import { isApiCustomError } from '@ovh-ux/manager-core-api';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  Notifications,
  StepComponent,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import { usePrefetchInstances } from '@/api/hooks/instance/useInstances';
import { usePrefetchSnapshotPricing } from '@/api/hooks/order';
import { useAddWorkflow } from '@/api/hooks/workflows';
import { useSafeParam } from '@/hooks/useSafeParam';

import { useWorkflowStepper } from './hooks/useWorkflowStepper';
import { WorkflowName } from './steps/WorkflowName.component';
import { WorkflowResource } from './steps/WorkflowResource.component';
import { WorkflowScheduling, getCron } from './steps/WorkflowScheduling.component';
import { WorkflowType } from './steps/WorkflowType.component';

export default function NewPage() {
  const { t } = useTranslation('workflow-add');
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tListing } = useTranslation('listing');
  const stepper = useWorkflowStepper();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const projectId = useSafeParam('projectId');
  const { data: project } = useProject();
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const navigate = useNavigate();

  // Prefetch instances
  usePrefetchInstances(projectId);
  usePrefetchSnapshotPricing(projectId);

  const { addWorkflow, isPending: isAdding } = useAddWorkflow({
    projectId,
    onError: (err) => {
      stepper.scheduling.onSubmitError();
      addError(
        <Translation ns="workflow-add">
          {(tr) =>
            tr('pci_workflow_add_error', {
              message: isApiCustomError(err) ? err.response?.data.message : err.message,
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
          isDisabled: stepper.scheduling.step.isLocked,
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
            isDisabled: stepper.scheduling.step.isLocked,
          }}
        >
          <WorkflowResource
            step={stepper.resource.step}
            onSubmit={stepper.resource.submit}
            instanceId={stepper.form.instanceId}
            onUpdate={stepper.resource.update}
          />
        </StepComponent>
      </div>
      <div className="mt-8">
        <StepComponent
          order={3}
          {...stepper.naming.step}
          edit={{
            action: stepper.naming.edit,
            label: tCommon('common_stepper_modify_this_step'),
            isDisabled: stepper.scheduling.step.isLocked,
          }}
          isLocked={stepper.naming.step.isLocked}
          title={t('pci_workflow_create_general-info_title')}
        >
          <WorkflowName
            name={stepper.form.name}
            instanceId={stepper.form.instanceId}
            step={stepper.naming.step}
            onNameChange={stepper.naming.update}
            onSubmit={stepper.naming.submit}
          />
        </StepComponent>
      </div>
      <div className="mt-8">
        <StepComponent
          order={4}
          {...stepper.scheduling.step}
          isLocked={stepper.scheduling.step.isLocked}
          title={t('pci_workflow_create_schedule_title')}
        >
          <>
            <Notifications />
            <WorkflowScheduling
              instanceId={stepper.form.instanceId}
              step={stepper.scheduling.step}
              onSubmit={(scheduling, distantRegion) => {
                stepper.scheduling.submit(scheduling, distantRegion);
                addWorkflow({
                  cron: getCron(scheduling),
                  instanceId: stepper.form.instanceId,
                  name: stepper.form.name,
                  rotation: scheduling.rotation,
                  maxExecutionCount: scheduling.maxExecutionCount,
                  distantRegion,
                });
              }}
            />
            {isAdding && (
              <div className="mt-5">
                <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="align-middle" />
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
          </>
        </StepComponent>
      </div>
    </>
  );
}
