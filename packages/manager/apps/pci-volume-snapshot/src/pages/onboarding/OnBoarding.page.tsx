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
import { useTranslation } from 'react-i18next';
import { useAllSnapshots } from '@/api/hooks/useSnapshots';
import { TRANSFER_VOLUME_BACKUP_FROM_ONE_DATACENTRE_TO_ANOTHER_URL } from './onboarding.constants';
import { TFunction } from 'i18next';

const OnBoardingDescription = ({ t }: { t: TFunction }): JSX.Element => {
  return (
    <div className="flex flex-col text-center gap-6">
      <OdsText>
        {t('pci_projects_project_storages_snapshots_onboarding_content1')}
      </OdsText>
      <OdsText className="fw-bold">
        {t('pci_projects_project_storages_snapshots_onboarding_content2')}
      </OdsText>
      <OdsText>
        {t('pci_projects_project_storages_snapshots_onboarding_content3')}
      </OdsText>
      <OdsText>
        {t('pci_projects_project_storages_snapshots_onboarding_content4')}
      </OdsText>
      <OdsText>
        {t('pci_projects_project_storages_snapshots_onboarding_content5')}
      </OdsText>
    </div>
  );
};

export default function OnBoardingPage() {
  const { t } = useTranslation(['onboarding', 'volumes']);

  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const addSnapshotUrl = `${hrefProject}/storages/blocks`;

  const { data: allSnapshots, isLoading } = useAllSnapshots(
    project?.project_id || '',
  );

  const shouldRedirectToListing =
    !isLoading && !!allSnapshots && allSnapshots.length > 0;

  return (
    <RedirectionGuard
      isLoading={isLoading}
      route={'..'}
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
              href=""
              label={t('pci_projects_project_storages_snapshots_title', {
                ns: 'volumes',
              })}
            />
          </OdsBreadcrumb>
        }
      >
        <PciAnnouncementBanner />
        <OnboardingLayout
          img={{ src: 'assets/snapshots.png' }}
          title={t('pci_projects_project_storages_snapshots_title', {
            ns: 'volumes',
          })}
          description={<OnBoardingDescription t={t} />}
          orderButtonLabel={t(
            'pci_projects_project_storages_snapshots_onboarding_action_label',
          )}
          onOrderButtonClick={() => {
            window.location.href = addSnapshotUrl;
          }}
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
