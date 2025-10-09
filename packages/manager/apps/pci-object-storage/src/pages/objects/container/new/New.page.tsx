import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  Links,
  LinkType,
  Notifications,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import {
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ObjectContainerMode,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  STORAGE_PRICES_LINK,
} from '@/constants';
import { SolutionStepComponent } from './step/SolutionStep.component';
import { DeploymentModeStep } from './step/DeploymentModeStep.component';
import { useContainerCreationStore } from './useContainerCreationStore';
import { RegionStep } from './step/RegionStep.component';
import { ContainerType } from './step/ContainerTypeStep.component';
import { ContainerNameStep } from './step/ContainerNameStep.component';
import { LinkUserStep } from './step/LinkUserStep.component';
import { VersioningStep } from './step/VersioningStep.component';
import { EncryptionStep } from './step/EncryptionStep.component';
import { useCreateContainer } from '@/api/hooks/useStorages';
import { TStorage } from '@/api/data/storages';
import { OffsiteReplication } from './step/OffsiteReplicationStep.component';
import './style.scss';

export default function ContainerNewPage() {
  const { t } = useTranslation('containers/add');
  const { trackPage } = useOvhTracking();
  const projectHref = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const context = useContext(ShellContext);
  const navigate = useNavigate();

  const { addError, addSuccess } = useNotifications();
  const { ovhSubsidiary } = context.environment.getUser();
  const pricesLink =
    STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;
  const { form, reset } = useContainerCreationStore();
  const { createContainer, isPending } = useCreateContainer({
    projectId: project.project_id,
    onSuccess: (container: TStorage) => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'add_objects_storage_container_success',
      });

      addSuccess(
        <Translation ns="containers/add">
          {(_t) =>
            _t('pci_projects_project_storages_containers_add_success_message', {
              container: container.name,
              userName: '',
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'add_objects_storage_container_error',
      });
      addError(
        <Translation ns="containers/add">
          {(_t) =>
            _t('pci_projects_project_storages_containers_add_error_post', {
              container: form.containerName,
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );

      window.scrollTo(0, 0);
    },
  });

  const onCreateContainer = () => {
    const containerData: Parameters<typeof createContainer>[0] = {
      offer: form.offer,
      containerName: form.containerName,
      region: form.region.name,
      ownerId: form.ownerId,
      encryption: form.encryption,
      versioning: form.versioning,
      containerType: form.containerType,
      offsiteReplication: form.offsiteReplication,
      offsiteReplicationRegion: form.offsiteReplicationRegion,
    };

    createContainer(containerData);
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={projectHref} label={project?.description} />
          <OdsBreadcrumbItem
            href=""
            label={t('pci_projects_project_storages_containers_add_title')}
          />
        </OdsBreadcrumb>
      }
      header={{
        title: t('pci_projects_project_storages_containers_add_title'),
      }}
    >
      <div className="mb-6">
        <OdsText preset="paragraph">
          {t('pci_projects_project_storages_containers_add_description')}
        </OdsText>
        <Links
          className="block mt-4"
          href={pricesLink}
          target="_blank"
          type={LinkType.external}
          label={t(
            'pci_projects_project_storages_containers_add_description_link',
          )}
        />
      </div>

      <div className="mb-5 sticky top-0 z-50">
        <PciDiscoveryBanner project={project} />
      </div>

      <div className="my-4">
        <Notifications />
      </div>

      <SolutionStepComponent />
      {form.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD && (
        <DeploymentModeStep />
      )}
      <RegionStep />
      {form.offer === OBJECT_CONTAINER_OFFER_SWIFT && <ContainerType />}
      {form.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD &&
        form.deploymentMode !== ObjectContainerMode.LOCAL_ZONE && (
          <>
            {form.deploymentMode === ObjectContainerMode.MULTI_ZONES && (
              <OffsiteReplication />
            )}
            <VersioningStep />
            <LinkUserStep />

            <EncryptionStep />
          </>
        )}
      <ContainerNameStep
        isCreationPending={isPending}
        onSubmit={onCreateContainer}
      />
      <OdsText preset="span" className="m-8">
        {t('pci_projects_project_storages_containers_disclaimer')}
      </OdsText>
    </BaseLayout>
  );
}
