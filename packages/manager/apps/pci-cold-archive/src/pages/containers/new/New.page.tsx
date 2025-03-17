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
import { ContainerNameStep } from './steps/ContainerNameStep.component';
import { LinkUserStep } from './steps/LinkUserStep.component';
import { useContainerCreationStore } from './useContainerCreationStore';
import GuideMenu from '@/components/GuideMenu.component';
import { useUserCredentials } from '@/api/hooks/useUsers';

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
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const pricesLink =
    CHECK_PRICES_DOC_LINK[ovhSubsidiary] || CHECK_PRICES_DOC_LINK.DEFAULT;
  const { form, reset } = useContainerCreationStore();
  const goBack = () => navigate('..');

  const {
    getCredentialsAsync,
    isPending: isCredentialsPending,
  } = useUserCredentials(project.project_id, form.ownerId);

  const reportError = (error: ApiError) => {
    clearNotifications();
    addError(
      <Translation ns="cold-archive/new">
        {(_t) =>
          _t(
            'pci_projects_project_storages_cold_archive_add_action_create_archive_create_request_failed',
            {
              containerName: form.containerName,
              message: error?.response?.data?.message || error?.message || null,
            },
          )
        }
      </Translation>,
      true,
    );
    trackErrorPage();
    window.scrollTo(0, 0);
  };

  const {
    createContainerAsync,
    isPending: isCreationPending,
  } = useCreateContainer({
    projectId: project.project_id,
  });

  const isPending = isCreationPending || isCredentialsPending;

  const onCreateContainer = async () => {
    trackConfirmAction();
    try {
      const s3Credentials = await getCredentialsAsync();
      const container = await createContainerAsync({
        ownerId: form.ownerId,
        name: form.containerName,
      });
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
          accessKey={s3Credentials.access}
          secret={s3Credentials.secret}
          trackingPrefix={COLD_ARCHIVE_TRACKING.CONTAINERS.CLIPBOARD_PREFIX}
        />,
        false,
      );
      trackSuccessPage();
      goBack();
    } catch (error) {
      reportError(error);
    }
  };

  useEffect(() => {
    reset();
    clearNotifications();
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

        <PciDiscoveryBanner project={project} />

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
