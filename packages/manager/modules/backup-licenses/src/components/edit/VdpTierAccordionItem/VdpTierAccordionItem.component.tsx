import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsAccordion, OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import FeatureList from '@/components/order/FeatureList/FeatureList.component';
import RadioIndicator from '@/components/order/RadioIndicator/RadioIndicator.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { VdpTierCardData } from '@/types/Order.type';

interface VdpTierAccordionItemProps {
  card: VdpTierCardData;
  selected: boolean;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

/** Repli d'un niveau Veeam Data Platform dans la modale d'édition (BKP-1218) — même contenu
 * que la carte du tunnel de commande, en accordéon ODS pour ne pas saturer la modale. */
export default function VdpTierAccordionItem({
  card,
  selected,
  isOpen,
  onToggle,
}: VdpTierAccordionItemProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const base = `tier.${card.i18nKey}`;

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
      </span>
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-600)]">
          <Trans i18nKey={`${base}.audience`} t={t} components={{ b: <b /> }} />
        </OdsText>
        <span className="block rounded-md border border-solid border-[var(--ods-color-neutral-200)] bg-[var(--ods-color-neutral-050)] p-5">
          <OdsText preset={ODS_TEXT_PRESET.caption} className="text-[var(--ods-color-neutral-600)]">
            {t(`${base}.price`)}
          </OdsText>
        </span>
        <FeatureList idPrefix={`edit-tier-${card.i18nKey}`} features={card.features} />
      </div>
    </OdsAccordion>
  );
}
