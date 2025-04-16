import {
  BaseLayout,
  Card,
  OnboardingLayout,
  RedirectionGuard,
  useMe,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import { PciAnnouncementBanner, useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import { useBackups } from '@/data/hooks/useVolumeBackup';
import { GUIDES } from '@/constants';

type TGuide = typeof GUIDES[number];

export default function Onboarding() {
  const { t } = useTranslation(['onboarding', 'pci-volume-backup']);
  const { me } = useMe();

  const navigate = useNavigate();

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const { tracking } = useContext(ShellContext).shell;

  const handleDocumentationClick = (guideId: string) => {
    tracking?.trackClick({
      name: `${VOLUME_BACKUP_TRACKING.ONBOARDING.GUIDE}::${guideId}`,
      type: 'action',
    });
  };

  const goToCreateVolumeBackup = () => navigate('../create');

  const handleAddVolumeBlockStorageClick = () => {
    tracking?.trackClick({
      name: VOLUME_BACKUP_TRACKING.ONBOARDING.ADD,
      type: 'action',
    });

    goToCreateVolumeBackup();
  };

  const { data: allVolumeBackup, isLoading, error } = useBackups(
    project?.project_id,
  );

  const shouldRedirectToListing =
    !isLoading && !!allVolumeBackup && allVolumeBackup.length > 0;

  if (error) {
    throw new Error(error.message);
  }

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
              label={t(
                'pci_projects_project_storages_volume_backup_onboarding_title',
              )}
            />
          </OdsBreadcrumb>
        }
      >
        <PciAnnouncementBanner />
        <OnboardingLayout
          title={t(
            'pci_projects_project_storages_volume_backup_onboarding_title',
          )}
          description={
            <div className="flex flex-col text-center gap-6">
              <OdsText>
                {t(
                  'pci_projects_project_storages_volume_backup_onboarding_description_part_1',
                )}
              </OdsText>
              <OdsText>
                {t(
                  'pci_projects_project_storages_volume_backup_onboarding_description_part_2',
                )}
              </OdsText>
            </div>
          }
          orderButtonLabel={t(
            'pci_projects_project_storages_volume_backup_onboarding_action_title',
          )}
          onOrderButtonClick={handleAddVolumeBlockStorageClick}
        >
          {GUIDES.map((guide: TGuide) => (
            <Card
              key={guide.id}
              href={
                guide.links[me?.ovhSubsidiary as keyof typeof guide.links] ||
                guide.links.DEFAULT
              }
              texts={{
                title: t(
                  `pci_projects_project_storages_volume_backup_guides_${guide.id}_title`,
                  { ns: 'pci-volume-backup' },
                ),
                description: t(
                  `pci_projects_project_storages_volume_backup_guides_${guide.id}_description`,
                  { ns: 'pci-volume-backup' },
                ),
                category: t('onboarding_guide_title'),
              }}
              onClick={() => handleDocumentationClick(guide.id)}
            />
          ))}
        </OnboardingLayout>
      </BaseLayout>
    </RedirectionGuard>
  );
}
