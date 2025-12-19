import { GuidesHeader } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { memo, useContext } from 'react';
import { Guide, GUIDES } from '@/pages/list/guidesHeader.constants';
import { useTrackAction } from '@/hooks/useTrackAction';

export const StorageGuidesHeader = memo(() => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { t } = useTranslation(['common']);

  const getGuideLabel = (guide: Guide) =>
    t(`pci_projects_project_storages_blocks_guides_${guide.key}`);

  const handleTrackingGuideClick = useTrackAction((guide: Guide) => ({
    location: 'page',
    actionName: 'tile-tutorial',
    actionValues: [`go-to-${guide.key}`],
  }));

  return (
    <GuidesHeader
      label={t('pci_projects_project_storages_blocks_guides_header')}
      guides={GUIDES}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={getGuideLabel}
      onGuideClick={(guide) => handleTrackingGuideClick(guide)}
    />
  );
});
