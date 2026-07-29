import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsAccordion, OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import FeatureList from '@/components/order/FeatureList/FeatureList.component';
import RadioIndicator from '@/components/order/RadioIndicator/RadioIndicator.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseCardData } from '@/types/Order.type';

interface LicenseTypeAccordionItemProps {
  card: LicenseCardData;
  selected: boolean;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

/** Repli d'une famille de licence dans la modale d'édition (BKP-1218) — même contenu que la
 * carte du tunnel de commande, en accordéon ODS pour ne pas saturer la modale. */
export default function LicenseTypeAccordionItem({
  card,
  selected,
  isOpen,
  onToggle,
}: LicenseTypeAccordionItemProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const base = `license.${card.i18nKey}`;

  return (
    <OdsAccordion
      isOpen={isOpen}
      onOdsToggle={(event) => onToggle(event.detail.isOpen)}
      className={`order__accordion block ${selected ? 'order__accordion--selected' : ''}`}
      aria-current={selected ? 'true' : undefined}
    >
      <span slot="summary" className="flex flex-1 items-center gap-4">
        <RadioIndicator selected={selected} />
        <OdsText preset={ODS_TEXT_PRESET.heading6}>{t(`${base}.title`)}</OdsText>
        {card.recommended && (
          <OdsBadge
            label={t('badge.recommended')}
            color={ODS_BADGE_COLOR.information}
            size={ODS_BADGE_SIZE.sm}
          />
        )}
        <OdsText
          preset={ODS_TEXT_PRESET.caption}
          className="ml-auto text-[var(--ods-color-neutral-600)]"
        >
          {t(`${base}.price`)}
        </OdsText>
      </span>
      <div className="flex flex-col gap-4">
        <span className="flex flex-wrap gap-4">
          <OdsBadge
            label={t(`${base}.tag_vbr`)}
            color={ODS_BADGE_COLOR.neutral}
            size={ODS_BADGE_SIZE.sm}
          />
          <OdsBadge
            label={t(`${base}.tag_os`)}
            color={ODS_BADGE_COLOR.neutral}
            size={ODS_BADGE_SIZE.sm}
          />
        </span>
        <FeatureList idPrefix={`edit-feat-${card.i18nKey}`} features={card.features} withTooltips />
      </div>
    </OdsAccordion>
  );
}
