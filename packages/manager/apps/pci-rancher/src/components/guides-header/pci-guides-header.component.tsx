import { useTranslation } from 'react-i18next';
import { GuidesHeader } from './guides-header.component';
import { DEFAULT_GUIDES, GUIDES_LIST } from './pci-guides-header.constants';
import { Guide } from './types';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useContext } from 'react';

interface PciGuidesHeaderProps {
  category?: string;
}

export function PciGuidesHeader({ category }: PciGuidesHeaderProps) {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { t } = useTranslation('guide');
  return (
    <GuidesHeader
      label={t('pci_rancher_header')}
      guides={{ ...DEFAULT_GUIDES, ...GUIDES_LIST[category ?? 'rancher'] }}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={(guide: Guide) => t(`pci_rancher_header_${guide.key}`)}
    />
  );
}
