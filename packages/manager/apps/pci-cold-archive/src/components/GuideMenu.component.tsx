import { GuidesHeader } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import {
  COLD_ARCHIVE_OVERVIEW_LINKS,
  GETTING_STARTED_WITH_COLD_ARCHIVE_LINKS,
  MANAGE_YOUR_DATA_LINKS,
  STORAGE_BACKUP_LINKS,
} from '@/constants';

export default function GuideMenu() {
  const { t } = useTranslation(['cold-archive', 'pci-guides-header']);

  const {
    shell: { tracking },
    environment,
  } = useContext(ShellContext);

  const { ovhSubsidiary } = environment.getUser();

  const COLD_ARCHIVE_GUIDES = {
    'storage-backup': {
      key: 'storage-backup',
      url: STORAGE_BACKUP_LINKS,
    },
    overview: {
      key: 'overview',
      url: COLD_ARCHIVE_OVERVIEW_LINKS,
    },
    'getting-started-with-cold-archive': {
      key: 'getting-started-with-cold-archive',
      url: GETTING_STARTED_WITH_COLD_ARCHIVE_LINKS,
    },
    'manage-your-data': {
      key: 'manage-your-data',
      url: MANAGE_YOUR_DATA_LINKS,
    },
  };

  return (
    <GuidesHeader
      label={t('pci_project_guides_header', { ns: 'pci-guides-header' })}
      guides={COLD_ARCHIVE_GUIDES}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={(guide) =>
        t(
          `pci_projects_project_storages_cold_archives_guides_${guide.key}_title`,
        )
      }
      onGuideClick={(guide) => {
        tracking?.trackClick({
          name: `${COLD_ARCHIVE_TRACKING.GUIDE}_${guide.key}`,
          type: 'action',
        });
      }}
    />
  );
}
