import { ApiError } from '@ovh-ux/manager-core-api';
import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  Links,
  LinkType,
  Notifications,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useNavigate } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';
import { CHECK_PRICES_DOC_LINK } from '@/constants';
import UserInformationTile from '@/components/UserInformationTile.component';
import { useCreateContainer } from '@/api/hooks/useArchive';
import { TArchiveContainer } from '@/api/data/archive';
import { ContainerNameStep } from './steps/ContainerNameStep.component';
import { LinkUserStep } from './steps/LinkUserStep.component';
import { useContainerCreationStore } from './useContainerCreationStore';
import GuideMenu from '@/components/GuideMenu.component';

export default function ContainerNewPage() {
  const { t } = useTranslation([
    'cold-archive/new',
    'cold-archive',
    'users/credentials',
  ]);

  const projectHref = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const navigate = useNavigate();

  const { trackConfirmAction, trackSuccessPage, trackErrorPage } = useTracking(
    COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER,
  );

  const { addError, addSuccess } = useNotifications();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const pricesLink =
    CHECK_PRICES_DOC_LINK[ovhSubsidiary] || CHECK_PRICES_DOC_LINK.DEFAULT;

  const { form, reset } = useContainerCreationStore();

  const goBack = () => navigate('..');

  const { createContainer, isPending } = useCreateContainer({
    projectId: project.project_id,
    onSuccess: (container: TArchiveContainer) => {
      addSuccess(
        <UserInformationTile
          title={
            <OdsText preset="paragraph">
              <span
                dangerouslySetInnerHTML={{
                  __html: t(
                    'pci_projects_project_storages_containers_add_container_success',
                    {
                      containerName: `<strong>${container.name}</strong>`,
                      username: `<strong>${form.selectedUser.username}</strong>`,
                      role: `<strong>${form.selectedUser.roles[0]?.description}</strong>`,
                      ns: 'users/credentials',
                    },
                  ),
                }}
              />
            </OdsText>
          }
          username={form.selectedUser.username}
          description={form.selectedUser.description}
          accessKey={form.selectedUser?.s3Credentials?.access}
          secret={form.selectedUser?.s3Credentials?.secret}
        />,
        false,
      );

      trackSuccessPage();
      goBack();
    },
    onError: (error: ApiError) => {
      addError(
        <Translation ns="cold-archive/new">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_add_action_create_archive_create_request_failed',
              {
                containerName: form.containerName,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );

      trackErrorPage();
      window.scrollTo(0, 0);
    },
  });

  const onCreateContainer = () => {
    trackConfirmAction();
    createContainer({
      ownerId: form.ownerId,
      name: form.containerName,
    });
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem label={project.description} href={projectHref} />
          <OdsBreadcrumbItem
            label={t(
              'cold-archive:pci_projects_project_storages_cold_archive_label',
            )}
            href={useHref('..')}
          />

          <OdsBreadcrumbItem
            label={t(
              'pci_projects_project_storages_cold_archive_add_breadcrumb',
            )}
            href="#"
          />
        </OdsBreadcrumb>
      }
      header={{
        title: t('pci_projects_project_storages_cold_archive_add_title'),
        headerButton: <GuideMenu />,
      }}
      description={
        ((
          <div>
            <OdsText preset="paragraph" className="mr-4">
              {t('pci_projects_project_storages_cold_archive_add_description')}
            </OdsText>
            <Links
              href={pricesLink}
              target="_blank"
              type={LinkType.external}
              label={t(
                'pci_projects_project_storages_cold_archive_add_description_link',
              )}
            />
          </div>
        ) as unknown) as string
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <Notifications />
        </div>

        <div className="sticky top-0 z-50">
          <PciDiscoveryBanner project={project} />
        </div>

        <OdsMessage color="information" isDismissible={false}>
          {t(
            'pci_projects_project_storages_cold_archive_add_step_name_archive_localisation_banner_info',
          )}
        </OdsMessage>

        <LinkUserStep />
        <ContainerNameStep
          isCreationPending={isPending}
          onSubmit={onCreateContainer}
        />
      </div>
    </BaseLayout>
  );
}
