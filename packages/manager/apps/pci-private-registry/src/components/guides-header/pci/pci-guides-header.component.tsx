import React, { useContext } from 'react';
import {
  ShellContext,
  useEnvironment,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { GuidesHeader } from '../guides-header.component';
import { DEFAULT_GUIDES, GUIDES_LIST } from './pci-guides-header.constants';
import { Guide } from '../interface';

interface PciGuidesHeaderProps {
  category: string;
}

export function PciGuidesHeader({ category }: PciGuidesHeaderProps) {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { t } = useTranslation('guide');
  return (
    <GuidesHeader
      label={t('private_registry_header')}
      guides={{ ...DEFAULT_GUIDES, ...GUIDES_LIST[category] }}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={(guide: Guide) =>
        t(`private_registry_header_${guide.key}`)
      }
    />
  );
}
