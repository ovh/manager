import {
  Headers,
  StepComponent,
  useNotifications,
  useProjectUrl,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import HidePreloader from '@/core/HidePreloader';
import { VolumeTypeStep } from './components/VolumeTypeStep.component';
import { CapacityStep } from './components/CapacityStep.component';
import { VolumeNameStep } from './components/VolumeNameStep.component';
import { ValidationStep } from './components/ValidationStep.component';
import { LocationStep } from './components/LocationStep.component';
import { useVolumeStepper } from './hooks/useVolumeStepper';
import { useAddVolume } from '@/api/hooks/useVolume';
import { ExtenBannerBeta } from '@/components/exten-banner-beta/ExtenBannerBeta';

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
  const stepper = useVolumeStepper();

  const { addVolume } = useAddVolume({
    projectId,
    name: stepper.form.volumeName,
    regionName: stepper.form.region?.name,
    volumeCapacity: stepper.form.volumeCapacity,
    volumeType: stepper.form.volumeType?.blobs.technical.name,
    onSuccess: () => {
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
    },
    onError: (err: ApiError) => {
      stepper.validation.step.unlock();
      addError(
        <Translation ns="add">
          {(tr) =>
            tr('pci_projects_project_storages_blocks_add_error_post', {
              volume: stepper.form.volumeName,
              message: err?.response?.data?.message || err?.message || null,
            })
          }
        </Translation>,
        true,
      );
      // scroll to top of page to display error message
      window.scrollTo(0, 0);
    },
  });

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
          order={1}
          {...stepper.location.step}
          isLocked={stepper.location.step.isLocked || isDiscovery}
          title={tAdd('pci_projects_project_storages_blocks_add_region_title')}
          edit={{
            action: stepper.location.edit,
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
          order={2}
          {...stepper.volumeType.step}
          title={tAdd('pci_projects_project_storages_blocks_add_type_title')}
          edit={{
            action: stepper.volumeType.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: stepper.validation.step.isLocked,
          }}
        >
          <VolumeTypeStep
            projectId={projectId}
            region={stepper.form.region}
            step={stepper.volumeType.step}
            onSubmit={stepper.volumeType.submit}
          />
        </StepComponent>
        <StepComponent
          order={3}
          {...stepper.capacity.step}
          title={tAdd('pci_projects_project_storages_blocks_add_size_title')}
          edit={{
            action: stepper.capacity.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: stepper.validation.step.isLocked,
          }}
        >
          <CapacityStep
            projectId={projectId}
            region={stepper.form.region}
            volumeType={stepper.form.volumeType}
            step={stepper.capacity.step}
            onSubmit={stepper.capacity.submit}
          />
        </StepComponent>
        <StepComponent
          order={4}
          {...stepper.volumeName.step}
          title={tAdd('pci_projects_project_storages_blocks_add_name_title')}
          edit={{
            action: stepper.volumeName.edit,
            label: tStepper('common_stepper_modify_this_step'),
            isDisabled: stepper.validation.step.isLocked,
          }}
        >
          <VolumeNameStep
            projectId={projectId}
            step={stepper.volumeName.step}
            onSubmit={stepper.volumeName.submit}
          />
        </StepComponent>
        <StepComponent
          order={5}
          {...stepper.validation.step}
          title={tAdd('pci_projects_project_storages_blocks_add_submit_title')}
        >
          <ValidationStep
            volumeCapacity={stepper.form.volumeCapacity}
            volumeType={stepper.form.volumeType}
            onSubmit={() => {
              clearNotifications();
              stepper.validation.submit();
              addVolume();
            }}
          />
        </StepComponent>
      </div>
    </>
  );
}
