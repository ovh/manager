import { GuidesHeader } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { Guide } from '@ovh-ux/manager-react-components/dist/types/src/components/guides-header/interface';
import { memo, useContext } from 'react';
import { GUIDES } from '@/pages/list/guidesHeader.constants';

export const StorageGuidesHeader = memo(() => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { t } = useTranslation(['common']);
  return (
    <GuidesHeader
      label={t('pci_projects_project_storages_blocks_guides_header')}
      guides={GUIDES}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={(guide: Guide) =>
        t(`pci_projects_project_storages_blocks_guides_${guide.key}`)
      }
    />
  );
});
