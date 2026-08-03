import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import LicenseStep from '@/components/order/LicenseStep/LicenseStep.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

interface EditLicenseStepProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  onSelectFamily: (family: LicenseFamily) => void;
  onSelectTier: (tier: VdpTier) => void;
  isLicenseChanged: boolean;
}

/**
 * Étape ① de l'édition (BKP-1218) : mêmes cartes que le tunnel de commande (`LicenseStep`,
 * réutilisée telle quelle), initialisées depuis la licence installée au lieu de partir vierge.
 * S'y ajoute le message d'effet différé, propre à l'édition (le tunnel de commande n'a pas de
 * notion de licence déjà installée à comparer).
 */
export default function EditLicenseStep({
  family,
  tier,
  onSelectFamily,
  onSelectTier,
  isLicenseChanged,
}: EditLicenseStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);

  return (
    <div className="flex flex-col gap-6">
      <LicenseStep
        family={family}
        tier={tier}
        onSelectFamily={onSelectFamily}
        onSelectTier={onSelectTier}
      />
      {isLicenseChanged && (
        <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
          {t('edit.license_change_notice')}
        </OdsMessage>
      )}
    </div>
  );
}
