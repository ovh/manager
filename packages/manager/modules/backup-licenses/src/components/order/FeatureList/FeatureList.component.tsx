import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsIcon, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseFeatureItem } from '@/types/Order.type';
import {
  FEATURE_CHECK_DEFAULT_CLASS,
  FEATURE_CHECK_HIGHLIGHT_CLASS,
} from '@/utils/orderAccent/orderAccent';

interface FeatureListProps {
  /** Préfixe d'id unique pour les tooltips (ex. `feat-enterprise_plus`). */
  idPrefix: string;
  features: LicenseFeatureItem[];
  /** Affiche l'icône info + tooltip par feature (étape 1 uniquement). */
  withTooltips?: boolean;
}

/** Liste des features d'une carte (check + libellé + tooltip optionnel + surbrillance). */
export default function FeatureList({
  idPrefix,
  features,
  withTooltips = false,
}: FeatureListProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {features.map((feature) => {
        const triggerId = `${idPrefix}-${feature.key}`;
        return (
          <li key={feature.key} className="flex items-start gap-4">
            <span className="flex h-[1.3rem] shrink-0 items-center">
              <OdsIcon
                name={ODS_ICON_NAME.check}
                aria-hidden="true"
                className={`text-[1rem] ${
                  feature.highlight ? FEATURE_CHECK_HIGHLIGHT_CLASS : FEATURE_CHECK_DEFAULT_CLASS
                }`}
              />
            </span>
            <OdsText
              preset={ODS_TEXT_PRESET.caption}
              className={`flex-1 text-[0.8125rem] leading-[1.3rem] ${feature.highlight ? 'font-semibold' : ''}`}
            >
              {t(`feature.${feature.key}.label`)}
            </OdsText>
            {withTooltips && (
              <span className="flex h-[1.3rem] shrink-0 items-center">
                <OdsIcon
                  id={triggerId}
                  name={ODS_ICON_NAME.circleInfo}
                  aria-label={t(`feature.${feature.key}.label`)}
                  className="cursor-help text-[0.95rem] text-[var(--ods-color-neutral-400)]"
                />
                <OdsTooltip triggerId={triggerId}>{t(`feature.${feature.key}.tooltip`)}</OdsTooltip>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
