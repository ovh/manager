import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciDiscoveryBanner,
  useProductRegionsAvailability,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  Links,
  LinkType,
  Notifications,
  PciGuidesHeader,
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
import { ROUTE_PATHS } from '@/routes';
import { COLD_ARCHIVE_TRACKING, CHECK_PRICES_DOC_LINK } from '@/constants';
import { TArchiveContainer } from '@/api/data/archive';
import { ContainerNameStep } from './steps/ContainerNameStep.component';
import { useContainerCreationStore } from './useContainerCreationStore';
import { useCreateContainer } from '@/api/hooks/useArchive';
import { LinkUserStep } from './steps/LinkUserStep.component';
import UserInformationTile from '@/components/UserInformationTile.component';
import GuideMenu from '@/components/GuideMenu.component';

export default function ContainerNewPage() {
  const { t } = useTranslation(['cold-archive/new', 'cold-archive']);

  const projectHref = useProjectUrl('public-cloud');

  const { data: project } = useProject();

  const context = useContext(ShellContext);
  const navigate = useNavigate();

  const { tracking } = context.shell;

  const trackAddContainerClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${action}`,
      type: 'click',
    });
  };

  const trackAddContainerPage = (action: string) => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}_${action}`,
      type: 'navigation',
    });
  };

  const { addError, addSuccess } = useNotifications();
  const { ovhSubsidiary } = context.environment.getUser();

  const pricesLink =
    CHECK_PRICES_DOC_LINK[ovhSubsidiary] || CHECK_PRICES_DOC_LINK.DEFAULT;

  const { form, reset } = useContainerCreationStore();

  const goBack = () => navigate('..');

  const { data: regions } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const region = regions?.[0];

  const { createContainer, isPending } = useCreateContainer({
    projectId: project.project_id,
    region,
    onSuccess: (container: TArchiveContainer) => {
      addSuccess(
        <UserInformationTile
          title={
            <OdsText preset="paragraph">
              <span
                dangerouslySetInnerHTML={{
                  __html: t(
                    'users/credentials:pci_projects_project_storages_containers_add_container_success',
                    {
                      containerName: `<strong>${container.name}</strong>`,
                      username: `<strong>${form.selectedUser.username}</strong>`,
                      role: `<strong>${form.selectedUser.roles[0]?.description}</strong>`,
                    },
                  ),
                }}
              />
            </OdsText>
          }
          username={form.selectedUser.username}
          description={form.selectedUser.description}
          accessKey={form.selectedUser.s3Credentials.access}
          secret={form.selectedUser.s3Credentials.secret}
        />,
        false,
      );

      trackAddContainerPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
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

      trackAddContainerPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      window.scrollTo(0, 0);
    },
  });

  const onCreateContainer = () => {
    trackAddContainerClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);

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
            href={useHref(ROUTE_PATHS.STORAGES)}
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
    >
      <div className="flex flex-col gap-4">
        <div>
          <OdsText preset="paragraph">
            {t('pci_projects_project_storages_cold_archive_add_description')}
          </OdsText>
          <Links
            className="block mt-4"
            href={pricesLink}
            target="_blank"
            type={LinkType.external}
            label={t(
              'pci_projects_project_storages_cold_archive_add_description_link',
            )}
          />
        </div>

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
