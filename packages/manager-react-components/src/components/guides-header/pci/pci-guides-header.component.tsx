import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerReactComponentContext } from '../../../context/ManagerReactComponentsContext';
import { GuidesHeader } from '../guides-header.component';
import { GUIDES_LIST } from './pci-guides-header.constants';
import { Guide } from '../interface';
import './translations';

interface PciGuidesHeaderProps {
  category: string;
}

export function PciGuidesHeader({ category }: PciGuidesHeaderProps) {
  const context = useContext(ManagerReactComponentContext);
  const { shellContext } = context;
  const managerContext = useContext(shellContext);
  const user = managerContext?.environment?.getUser();
  const { ovhSubsidiary } = user;
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
        managerContext?.shell?.tracking?.trackClick({
          name: `public-cloud_credit_and_vouchers${guide.tracking}`,
          type: 'action',
        });
      }}
    />
  );
}
