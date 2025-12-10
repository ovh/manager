import { useContext } from 'react';
import { GuidesHeader } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { Guide, GUIDES } from './guidesHeader.constants';

export const VolumeSnapshotGuidesHeader = () => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { t } = useTranslation(['guides']);

  const getGuideLabel = (guide: Guide) =>
    t(`pci_projects_project_storages_snapshots_guides_${guide.key}`);

  return (
    <GuidesHeader
      label={t('pci_projects_project_storages_snapshots_guides_header')}
      guides={GUIDES}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={getGuideLabel}
    />
  );
};
