import { useContext } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciDiscoveryBanner,
  TProject,
  isDiscoveryProject,
  useProject,
  useParam as useSafeParams,
} from '@ovh-ux/manager-pci-common';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';

import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  StepComponent as StepComponentLayout,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  TClusterCreationForm,
  TNonNullableForm,
  useClusterCreationStepper,
} from './hooks/useCusterCreationStepper';

import { useCreateKubernetesCluster } from '@/api/hooks/useKubernetes';
import { PAGE_PREFIX } from '@/tracking.constants';
import stepsConfig from './steps/stepsConfig';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { isMonoDeploymentZone, isMultiDeploymentZones } from '@/helpers';
import { DeploymentMode, TClusterPlanEnum } from '@/types';

const formIsNonNullable = (
  form: TClusterCreationForm,
): form is TNonNullableForm => {
  if (!form.region?.type) return false;

  const regionType = form.region.type as DeploymentMode;

  // TODO:  When 3AZ will be available, update condition to make form.plan mandatory to create a cluster & remove "free" fallback value in createCluster call
  return (
    !!form.network &&
    ((isMultiDeploymentZones(regionType) && !!form.network.privateNetwork) ||
      isMonoDeploymentZone(regionType)) &&
    !!form.updatePolicy
  );
};

export default function NewPage() {
  const { t } = useTranslation(['add', 'listing', 'stepper']);
  const { contains3AZ } = useHas3AZRegions();
  const is3AZAvailable = use3AZPlanAvailable();
  const has3AZ = contains3AZ && is3AZAvailable;

  const { projectId } = useSafeParams('projectId');
  const { data: project } = useProject();
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const hrefBack = useHref('..');
  const hrefProject = useProjectUrl('public-cloud');
  const stepper = useClusterCreationStepper(has3AZ);
  const { addError, addSuccess } = useNotifications();
  const isDiscovery = isDiscoveryProject(project as TProject);

  const {
    createCluster,
    isPending: isCreationPending,
  } = useCreateKubernetesCluster({
    projectId,
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
      stepper.confirm.step.unlock();
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

  const createNewCluster = () => {
    tracking.trackClick({
      name: `${PAGE_PREFIX}::kubernetes::add::confirm`,
    });

    if (formIsNonNullable(stepper.form))
      createCluster({
        name: stepper.form.clusterName,
        plan: stepper.form.plan ?? TClusterPlanEnum.FREE,
        region: stepper.form.region.name,
        version: stepper.form.version,
        updatePolicy: stepper.form.updatePolicy,
        ...(stepper.form.nodePools && {
          nodepools: stepper.form.nodePools.map(
            ({ localisation: _1, monthlyPrice: _2, ...nodePool }) => nodePool,
          ),
        }),
        privateNetworkId: stepper.form.network.privateNetwork?.id,
        loadBalancersSubnetId: stepper.form.network.loadBalancersSubnet?.id,
        nodesSubnetId: stepper.form.network.subnet?.id,
        privateNetworkConfiguration: {
          defaultVrackGateway: stepper.form.network.gateway?.ip || '',
          privateNetworkRoutingAsDefault:
            stepper.form.network.gateway?.isEnabled,
        },
      });
  };

  const allSteps = stepsConfig({
    stepper,
    createNewCluster,
    projectId,
    are3AZRegions: has3AZ,
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
              label: t('listing:kube_list_title'),
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
      {/**  need to hide the global notif if opened * */}
      {(!stepper.location.step.isOpen || stepper.location.step.isChecked) && (
        <Notifications />
      )}

      <div className="mb-5 sticky top-0 z-50">
        {project && <PciDiscoveryBanner project={project} />}
      </div>

      <div className="mt-8">
        {allSteps
          .filter((step) => step.condition ?? true)
          .map(
            (
              {
                key,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                component: StepComponent,
                titleKey,
                extraProps = {},
              },
              index,
            ) => (
              <StepComponentLayout
                key={key}
                order={index + 1}
                {...stepper[key].step}
                title={t(titleKey)}
                edit={{
                  action: stepper[key].edit,
                  label: t('stepper:common_stepper_modify_this_step'),
                  isDisabled:
                    isCreationPending || (key === 'location' && isDiscovery),
                }}
              >
                <StepComponent
                  step={stepper[key].step}
                  onSubmit={stepper[key].submit}
                  {...extraProps}
                />
              </StepComponentLayout>
            ),
          )}
      </div>
    </>
  );
}
