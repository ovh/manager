import { useContext } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciDiscoveryBanner,
  isDiscoveryProject,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  StepComponent,
  useNotifications,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { useClusterCreationStepper } from './useCusterCreationStepper';
import { LocationStep } from './steps/LocationStep.component';
import { VersionStep } from './steps/VersionStep.component';
import { NetworkStep } from './steps/NetworkStep.component';
import { NodeTypeStep } from './steps/NodeTypeStep.component';
import { NodeSizeStep } from './steps/NodeSizeStep.component';
import { ClusterNameStep } from './steps/ClusterNameStep.component';
import { BillingStep } from './steps/BillingStep.component';
import { useCreateKubernetesCluster } from '@/api/hooks/useKubernetes';
import { PAGE_PREFIX } from '@/tracking.constants';

export default function NewPage() {
  const { t } = useTranslation('add');
  const { t: tListing } = useTranslation('listing');
  const { t: tStepper } = useTranslation('stepper');
  const { data: project } = useProject();
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const hrefBack = useHref('..');
  const hrefProject = useProjectUrl('public-cloud');
  const stepper = useClusterCreationStepper();
  const { addError, addSuccess } = useNotifications();
  const isDiscovery = isDiscoveryProject(project);

  const {
    createCluster,
    isPending: isCreationPending,
  } = useCreateKubernetesCluster({
    projectId: project.project_id,
    onSuccess: () => {
      navigate('..');
      addSuccess(
        <Translation ns="add">
          {(tr) => tr('kubernetes_add_success')}
        </Translation>,
        true,
      );
    },
    onError: (err: ApiError) => {
      stepper.clusterName.step.unlock();
      if (err.status === 412) {
        const kubeErrorId = (err?.response?.data?.message?.match(/\[(.*)\]/) ||
          [])[0];
        addError(
          <>
            <Translation ns="add">
              {(tr) =>
                tr('kubernetes_add_error', {
                  message: t(`kubernetes_add_error_${kubeErrorId}`),
                })
              }
            </Translation>
            ,
            <OsdsLink
              className="ml-4"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={`${hrefProject}/quota`}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              {t('kubernetes_add_error_quota_link')}
              <OsdsIcon
                className="ml-3"
                slot="end"
                name={ODS_ICON_NAME.EXTERNAL_LINK}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              ></OsdsIcon>
            </OsdsLink>
          </>,
          true,
        );
      } else {
        addError(
          <Translation ns="add">
            {(tr) =>
              tr('kubernetes_add_error', {
                message: err?.response?.data?.message || err?.message || null,
              })
            }
          </Translation>,
          true,
        );
      }
      // scroll to top of page to display error message
      window.scrollTo(0, 0);
    },
  });

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              href: hrefBack,
              label: tListing('kube_list_title'),
            },
            {
              label: t('kubernetes_add'),
            },
          ]}
        />
      )}

      <div className="mt-8">
        <Headers title={t('kubernetes_add')} />
      </div>
      <Notifications />

      <div className="mb-5">
        <PciDiscoveryBanner project={project} />
      </div>

      <div className="mt-8">
        <StepComponent
          order={1}
          {...stepper.location.step}
          isLocked={stepper.location.step.isLocked || isDiscovery}
          title={t('kubernetes_add_region_title')}
          edit={{
            action: stepper.location.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isDiscovery || isCreationPending,
          }}
        >
          <LocationStep
            projectId={project.project_id}
            onSubmit={stepper.location.submit}
            step={stepper.location.step}
          />
        </StepComponent>
        <StepComponent
          order={2}
          {...stepper.version.step}
          title={t('kubernetes_add_version_title')}
          edit={{
            action: stepper.version.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isCreationPending,
          }}
        >
          <VersionStep
            onSubmit={stepper.version.submit}
            step={stepper.version.step}
          />
        </StepComponent>
        <StepComponent
          order={3}
          {...stepper.network.step}
          title={tListing('kubernetes_add_private_network')}
          edit={{
            action: stepper.network.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isCreationPending,
          }}
        >
          <NetworkStep
            region={stepper.form.region?.name}
            onSubmit={stepper.network.submit}
            step={stepper.network.step}
          />
        </StepComponent>
        <StepComponent
          order={4}
          {...stepper.nodeType.step}
          title={tListing('kube_common_node_pool_title')}
          edit={{
            action: stepper.nodeType.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isCreationPending,
          }}
        >
          <NodeTypeStep
            projectId={project.project_id}
            region={stepper.form.region?.name}
            onSubmit={stepper.nodeType.submit}
            step={stepper.nodeType.step}
          />
        </StepComponent>
        <StepComponent
          order={5}
          {...stepper.nodeSize.step}
          title={tListing('kube_common_node_pool_autoscaling_title')}
          edit={{
            action: stepper.nodeSize.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isCreationPending,
          }}
        >
          <NodeSizeStep
            isMonthlyBilling={stepper.form.isMonthlyBilled}
            onSubmit={stepper.nodeSize.submit}
            step={stepper.nodeSize.step}
          />
        </StepComponent>
        <StepComponent
          order={6}
          {...stepper.billing.step}
          title={t('kubernetes_add_billing_anti_affinity_title')}
          edit={{
            action: stepper.billing.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isCreationPending,
          }}
        >
          <BillingStep
            form={stepper.form}
            onSubmit={stepper.billing.submit}
            step={stepper.billing.step}
          />
        </StepComponent>
        <StepComponent
          order={7}
          {...stepper.clusterName.step}
          title={t('kubernetes_add_name_title')}
        >
          {!stepper.clusterName.step.isLocked && (
            <ClusterNameStep
              onNameChange={stepper.clusterName.update}
              onSubmit={() => {
                stepper.clusterName.step.lock();
                createCluster({
                  name: stepper.form.clusterName,
                  region: stepper.form.region?.name,
                  version: stepper.form.version,
                  nodepool: {
                    antiAffinity: false, // @ TODO
                    autoscale: stepper.form.scaling?.isAutoscale,
                    desiredNodes: stepper.form.scaling?.quantity.desired,
                    minNodes: stepper.form.scaling?.quantity.min,
                    maxNodes: stepper.form.scaling?.quantity.max,
                    flavorName: stepper.form.flavor?.name,
                    monthlyBilled: false, // @TODO
                  },
                  privateNetworkId: undefined, // @TODO
                  privateNetworkConfiguration: undefined, // @TODO
                });
                tracking.trackClick({
                  name: `${PAGE_PREFIX}::kubernetes::add::confirm`,
                });
              }}
            />
          )}
          {stepper.clusterName.step.isLocked && (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          )}
        </StepComponent>
      </div>
    </>
  );
}