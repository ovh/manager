import {
  Headers,
  Links,
  LinkType,
  Notifications,
  StepComponent,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Trans, Translation, useTranslation } from 'react-i18next';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import {
  isApiCustomError,
  isMaxQuotaReachedError,
} from '@ovh-ux/manager-core-api';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useContext } from 'react';
import HidePreloader from '@/core/HidePreloader';
import { VolumeTypeStep } from './components/VolumeTypeStep.component';
import { CapacityStep } from './components/CapacityStep.component';
import { VolumeNameStep } from './components/VolumeNameStep.component';
import { ValidationStep } from './components/ValidationStep.component';
import { LocationStep } from './components/LocationStep.component';
import { useVolumeStepper } from './hooks/useVolumeStepper';
import { useAddVolume } from '@/api/hooks/useVolume';
import { ExtenBannerBeta } from '@/components/exten-banner-beta/ExtenBannerBeta';
import { AvailabilityZoneStep } from '@/pages/new/components/AvailabilityZoneStep';
import { DEPLOYMENT_MODES_HELP_URL } from '@/constants';
import ExternalLink from '@/components/ExternalLink';
import { useTrackAction } from '@/hooks/useTrackAction';
import { useTrackBanner } from '@/hooks/useTrackBanner';

export default function NewPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { t: tAdd } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');
  const { projectId } = useParams();
  const { data: project } = useProject();
  const navigate = useNavigate();
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const isDiscovery = isDiscoveryProject(project);
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const stepper = useVolumeStepper(projectId);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const onTrackingBannerSuccess = useTrackBanner({ type: 'success' }, () => {
    navigate('..');
    addSuccess(
      <Translation ns="add">
        {(tr) =>
          tr('pci_projects_project_storages_blocks_add_success_message', {
            volume: stepper.form.volumeName,
          })
        }
      </Translation>,
      true,
    );
  });

  const onTrackingBannerError = useTrackBanner(
    { type: 'error' },
    (err: unknown) => {
      stepper.validation.step.unlock();
      if (isApiCustomError(err)) {
        if (isMaxQuotaReachedError(err)) {
          addError(
            <Trans
              ns="add"
              i18nKey="pci_projects_project_storages_blocks_add_error_quota_exceeded"
              components={{
                Link: (
                  <ExternalLink href={`${projectUrl}/quota`} isTargetBlank />
                ),
              }}
            />,
            true,
          );
        } else {
          addError(
            <Trans
              ns="add"
              i18nKey="pci_projects_project_storages_blocks_add_error_post"
              values={{
                volume: stepper.form.volumeName,
                message: err.response?.data.message || err.message || null,
              }}
            />,
            true,
          );
        }
      }
      // scroll to top of page to display error message
      window.scrollTo(0, 0);
    },
  );

  const { addVolume } = useAddVolume({
    projectId,
    onSuccess: onTrackingBannerSuccess,
    onError: onTrackingBannerError,
  });

  const deploymentModesUrl =
    DEPLOYMENT_MODES_HELP_URL[ovhSubsidiary] ||
    DEPLOYMENT_MODES_HELP_URL.DEFAULT;

  const onTrackingEditAvailabilityZone = useTrackAction(
    {
      buttonType: 'link',
      actionName: 'edit_step_location_detailed',
      actionValues: [stepper.form.region?.name, 'manually'],
    },
    stepper.availabilityZone.edit,
  );

  return (
    <>
      <HidePreloader />
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
              label: t('pci_projects_project_storages_blocks_title'),
            },
            {
              label: tAdd('pci_projects_project_storages_blocks_add_title'),
            },
          ]}
        />
      )}
      <Headers title={tAdd('pci_projects_project_storages_blocks_add_title')} />
      <Notifications />

      <div className="mb-5">
        <PciDiscoveryBanner project={project} />
      </div>

      <div className="mb-5">
        <ExtenBannerBeta />
      </div>

      <div className="mt-8">
        <StepComponent
          order={stepper.getOrder(stepper.location.step)}
          {...stepper.location.step}
          isLocked={stepper.location.step.isLocked || isDiscovery}
          title={tAdd('pci_projects_project_storages_blocks_add_region_title')}
          edit={{
            action: useTrackAction(
              {
                buttonType: 'link',
                actionName: 'edit_step_location',
                actionValues: [stepper.form.region?.name],
              },
              stepper.location.edit,
            ),
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: isDiscovery || stepper.validation.step.isLocked,
          }}
        >
          <LocationStep
            projectId={projectId}
            step={stepper.location.step}
            onSubmit={stepper.location.submit}
          />
        </StepComponent>
        <StepComponent
          order={stepper.getOrder(stepper.volumeType.step)}
          {...stepper.volumeType.step}
          title={tAdd('pci_projects_project_storages_blocks_add_type_title')}
          edit={{
            action: useTrackAction(
              {
                buttonType: 'link',
                actionName: 'edit_step_volume',
                actionValues: [stepper.form.volumeType],
              },
              stepper.volumeType.edit,
            ),
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: stepper.validation.step.isLocked,
          }}
          subtitle={
            <span>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tAdd('pci_projects_project_storages_blocks_add_type_subtitle')}
              </OsdsText>
              {stepper.form.region?.type === 'region-3-az' && (
                <Links
                  label={tAdd(
                    'pci_projects_project_storages_blocks_add_type_subtitle_3AZ_link',
                  )}
                  href={deploymentModesUrl}
                  target={OdsHTMLAnchorElementTarget._blank}
                  className="ml-2"
                  type={LinkType.external}
                />
              )}
            </span>
          }
        >
          <VolumeTypeStep
            projectId={projectId}
            region={stepper.form.region}
            step={stepper.volumeType.step}
            onSubmit={stepper.volumeType.submit}
          />
        </StepComponent>
        {stepper.availabilityZone.step.isShown && (
          <StepComponent
            order={stepper.getOrder(stepper.availabilityZone.step)}
            {...stepper.availabilityZone.step}
            title={tAdd(
              'pci_projects_project_storages_blocks_add_availability_zone',
            )}
            edit={{
              action: onTrackingEditAvailabilityZone,
              label: tStepper('common_stepper_modify_this_step'),
              isDisabled: stepper.validation.step.isLocked,
            }}
            subtitle={
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tAdd(
                  'pci_projects_project_storages_blocks_add_availability_zone_subtitle',
                )}
              </OsdsText>
            }
          >
            {!!stepper.form.region?.name && (
              <AvailabilityZoneStep
                step={stepper.availabilityZone.step}
                region={stepper.form.region}
                onSubmit={stepper.availabilityZone.submit}
              />
            )}
          </StepComponent>
        )}
        <StepComponent
          order={stepper.getOrder(stepper.capacity.step)}
          {...stepper.capacity.step}
          title={tAdd('pci_projects_project_storages_blocks_add_size_title')}
          edit={{
            action: useTrackAction(
              {
                buttonType: 'link',
                actionName: 'edit_step_configure_volume_capacity',
              },
              stepper.capacity.edit,
            ),
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: stepper.validation.step.isLocked,
          }}
        >
          <CapacityStep
            projectId={projectId}
            region={stepper.form.region}
            volumeType={stepper.form.volumeType}
            encryptionType={stepper.form.encryptionType}
            step={stepper.capacity.step}
            onSubmit={stepper.capacity.submit}
          />
        </StepComponent>
        <StepComponent
          order={stepper.getOrder(stepper.volumeName.step)}
          {...stepper.volumeName.step}
          title={tAdd('pci_projects_project_storages_blocks_add_name_title')}
          edit={{
            action: useTrackAction(
              { buttonType: 'link', actionName: 'edit_step_name' },
              stepper.volumeName.edit,
            ),
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: stepper.validation.step.isLocked,
          }}
        >
          {!!stepper.form.region &&
            !!stepper.form.region &&
            !!stepper.form.volumeCapacity && (
              <VolumeNameStep
                projectId={projectId}
                step={stepper.volumeName.step}
                onSubmit={stepper.volumeName.submit}
                volumeType={stepper.form.volumeType}
                encryptionType={stepper.form.encryptionType}
                region={stepper.form.region.name}
                volumeCapacity={stepper.form.volumeCapacity}
              />
            )}
        </StepComponent>
        <StepComponent
          order={stepper.getOrder(stepper.validation.step)}
          {...stepper.validation.step}
          title={tAdd('pci_projects_project_storages_blocks_add_submit_title')}
        >
          <ValidationStep
            volumeCapacity={stepper.form.volumeCapacity}
            projectId={projectId}
            region={stepper.form.region}
            volumeType={stepper.form.volumeType}
            encryptionType={stepper.form.encryptionType}
            onSubmit={() => {
              clearNotifications();
              stepper.validation.submit();
              addVolume({
                region: stepper.form.region.name,
                type: stepper.form.volumeType,
                encryptionType: stepper.form.encryptionType,
                name: stepper.form.volumeName,
                size: stepper.form.volumeCapacity,
                availabilityZone: stepper.form.availabilityZone,
              });
            }}
          />
        </StepComponent>
      </div>
    </>
  );
}
