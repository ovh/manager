import { useContext } from 'react';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciDiscoveryBanner,
  TProject,
  isDiscoveryProject,
  useProject,
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
import { useClusterCreationStepper } from './useCusterCreationStepper';

import { useCreateKubernetesCluster } from '@/api/hooks/useKubernetes';
import { PAGE_PREFIX } from '@/tracking.constants';
import stepsConfig from './steps/stepsConfig';

export default function NewPage() {
  const { t } = useTranslation(['add', 'listing', 'stepper']);
  const are3AZRegions = true;
  const { projectId } = useParams();
  const { data: project } = useProject();
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const hrefBack = useHref('..');
  const hrefProject = useProjectUrl('public-cloud');
  const stepper = useClusterCreationStepper(are3AZRegions);
  const { addError, addSuccess } = useNotifications();
  const isDiscovery = isDiscoveryProject(project as TProject);

  const {
    createCluster,
    isPending: isCreationPending,
  } = useCreateKubernetesCluster({
    projectId: project?.project_id ?? '',
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

  const nodePoolEnabled = !!stepper.form.nodePools;

  const createNewCluster = () => {
    tracking.trackClick({
      name: `${PAGE_PREFIX}::kubernetes::add::confirm`,
    });
    createCluster({
      name: stepper.form.clusterName,
      region: stepper.form.region?.name,
      version: stepper.form.version,
      updatePolicy: stepper.form.updatePolicy,
      ...(nodePoolEnabled && {
        nodepools: stepper.form.nodePools.map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ localisation: _1, monthlyPrice: _2, ...nodePool }) => nodePool,
        ),
      }),
      privateNetworkId:
        stepper.form.network?.privateNetwork?.clusterRegion?.openstackId ||
        undefined,
      loadBalancersSubnetId:
        stepper.form.network?.loadBalancersSubnet?.id || undefined,
      nodesSubnetId: stepper.form.network?.subnet?.id || undefined,
      privateNetworkConfiguration: {
        defaultVrackGateway: stepper.form.network?.gateway?.ip || '',
        privateNetworkRoutingAsDefault:
          stepper.form.network?.gateway?.isEnabled,
      },
    });
  };

  const allSteps = stepsConfig({
    stepper,
    createNewCluster,
    projectId,
    are3AZRegions,
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
              label: t('kube_list_title'),
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

      <div className="mb-5 sticky top-0 z-50">
        <PciDiscoveryBanner project={project} />
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
