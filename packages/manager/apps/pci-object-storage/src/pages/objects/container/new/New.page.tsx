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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  STORAGE_PRICES_LINK,
  TRACKING_PREFIX,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
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
  const projectHref = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const context = useContext(ShellContext);
  const navigate = useNavigate();
  const { tracking } = context.shell;
  const { addError, addSuccess } = useNotifications();
  const { ovhSubsidiary } = context.environment.getUser();
  const pricesLink =
    STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;
  const { form, reset } = useContainerCreationStore();
  const { createContainer, isPending } = useCreateContainer({
    projectId: project.project_id,
    onSuccess: (container: TStorage) => {
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
      const containerTypeOffer = form.containerType
        ? `${form.containerType}::`
        : '';
      tracking?.trackPage({
        name: `${TRACKING_PREFIX}_add::${form.offer}_${form.region}::${containerTypeOffer}creation_error`,
      });
    },
    onError: (error: ApiError) => {
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
      const containerTypeOffer = form.containerType
        ? `${form.containerType}::`
        : '';
      tracking?.trackPage({
        name: `${TRACKING_PREFIX}_add::${form.offer}_${form.region}::${containerTypeOffer}creation_error`,
      });
      window.scrollTo(0, 0);
    },
  });

  const onCreateContainer = () => {
    createContainer({
      ...form,
      region: form.region.name,
    });
    tracking?.trackClick({
      name: `storage_container_create_${form.offer}_${
        form.region
      }_${form.containerType || 'standard'}`,
      type: 'action',
    });
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
        form.deploymentMode !== OBJECT_CONTAINER_MODE_LOCAL_ZONE && (
          <>
            {form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES && (
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
