import React from 'react';
import {
  useEnvironment,
  useOvhTracking,
  PageLocation,
  ButtonType,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { GuidesHeader } from '../guides-header.component';
import { GUIDES_LIST } from './pci-guides-header.constants';
import { Guide } from '../interface';
import './translations';

interface PciGuidesHeaderProps {
  category: string;
}

export function PciGuidesHeader({ category }: PciGuidesHeaderProps) {
  const { ovhSubsidiary } = useEnvironment().getUser();
  const { trackClick } = useOvhTracking();
  const [t] = useTranslation('pci-guides-header');
  return (
    <GuidesHeader
      label={t('pci_project_guides_header')}
      guides={GUIDES_LIST[category]}
      ovhSubsidiary={ovhSubsidiary}
      getGuideLabel={(guide: Guide) =>
        t(`pci_project_guides_header_${guide.key}`)
      }
      onGuideClick={(guide: Guide) => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.tutorial,
          actionType: 'action',
          actions: [`go-to-${guide.tracking}`],
        });
      }}
    />
  );
}
