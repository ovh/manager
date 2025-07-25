import { PciAnnouncementBanner, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  Card,
  OnboardingLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useAllSnapshots } from '@/api/hooks/useSnapshots';
import { TRANSFER_VOLUME_BACKUP_FROM_ONE_DATACENTRE_TO_ANOTHER_URL } from './onboarding.constants';

export default function OnBoardingPage() {
  const { t } = useTranslation(['onboarding', 'volumes']);

  const { shell } = useContext(ShellContext);
  const { projectId } = useParams();

  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');

  const { data: allSnapshots, isLoading } = useAllSnapshots(
    project?.project_id,
  );

  const shouldRedirectToListing =
    !isLoading && !!allSnapshots && allSnapshots.length > 0;

  const snapshotTextKey =
    'pci_projects_project_storages_snapshots_onboarding_content';

  const snapshotDescription = [...Array(5).keys()].map((_key, index) => (
    <OdsText key={index} className={index === 1 ? 'fw-bold' : ''}>
      {t(`${snapshotTextKey}${index + 1}`)}
    </OdsText>
  ));

  return (
    <RedirectionGuard
      isLoading={isLoading}
      route=".."
      condition={shouldRedirectToListing}
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem
              href={hrefProject}
              label={project?.description}
            />
            <OdsBreadcrumbItem
              href="#"
              label={t('pci_projects_project_storages_snapshots_title', {
                ns: 'volumes',
              })}
            />
          </OdsBreadcrumb>
        }
      >
        <PciAnnouncementBanner />

        <OnboardingLayout
          data-testid="onboarding-layout"
          img={{ src: 'assets/snapshots.png' }}
          title={t('pci_projects_project_storages_snapshots_title', {
            ns: 'volumes',
          })}
          description={
            <div className="flex flex-col text-center gap-6">
              {snapshotDescription}
            </div>
          }
          orderButtonLabel={t(
            'pci_projects_project_storages_snapshots_onboarding_action_label',
          )}
          onOrderButtonClick={() =>
            shell.navigation.navigateTo(
              'public-cloud',
              `#/pci/projects/${projectId}/storages/volume-backup/create`,
              { volumeOption: 'volume_snapshot' },
            )
          }
        >
          <Card
            key="transfer-volume-backup"
            href={TRANSFER_VOLUME_BACKUP_FROM_ONE_DATACENTRE_TO_ANOTHER_URL}
            texts={{
              title: t(
                'pci_projects_project_storages_snapshots_onboarding_guides_transfer-volume-backup_title',
              ),
              description: t(
                'pci_projects_project_storages_snapshots_onboarding_guides_transfer-volume-backup_description',
              ),
              category: t('onboarding_guide_title'),
            }}
          />
        </OnboardingLayout>
      </BaseLayout>
    </RedirectionGuard>
  );
}
