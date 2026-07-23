import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

const METRIC_KEYS = ['included', 'overage', 'egress'] as const;
const ATTR_KEYS = ['managed', 'secured', 'scalable', 'pricing'] as const;
const PANEL_ID = 'vault-panel-details';

/**
 * Encart informatif Vault (étape 3) — purement informatif, non éditable.
 * Replié par défaut et dégradé visuellement (bordure neutre, une ligne de synthèse) :
 * sur une étape de configuration, l'attention doit aller aux champs à saisir, pas à
 * un rappel d'offre déjà vu aux étapes précédentes. Le détail (métriques + atouts)
 * reste accessible à la demande.
 */
export default function VaultInfoPanel() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--ods-color-neutral-200)]">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        aria-controls={PANEL_ID}
        className="flex w-full items-center justify-between gap-4 bg-[var(--ods-color-neutral-050)] px-6 py-4 text-left hover:bg-[var(--ods-color-neutral-100)]"
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-3">
            <OdsText preset={ODS_TEXT_PRESET.heading6}>
              {t('vault_panel.title')}
            </OdsText>
            <OdsBadge
              label={t('vault_panel.badge')}
              color={ODS_BADGE_COLOR.success}
              size={ODS_BADGE_SIZE.sm}
            />
          </span>
          <OdsText
            preset={ODS_TEXT_PRESET.caption}
            className="truncate text-[var(--ods-color-neutral-500)]"
          >
            {t('vault_panel.summary')}
          </OdsText>
        </span>
        <OdsIcon
          name={ODS_ICON_NAME.chevronDown}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div id={PANEL_ID}>
          <div className="flex border-t border-[var(--ods-color-neutral-100)]">
            {METRIC_KEYS.map((key) => (
              <div
                key={key}
                className="flex flex-1 flex-col items-center gap-3 border-l border-[var(--ods-color-neutral-100)] p-6 text-center first:border-l-0"
              >
                <OdsText
                  preset={ODS_TEXT_PRESET.heading5}
                  className="text-[var(--ods-color-primary-600)]"
                >
                  {t(`vault_panel.metric.${key}.value`)}
                </OdsText>
                <OdsText
                  preset={ODS_TEXT_PRESET.caption}
                  className="text-[var(--ods-color-neutral-500)]"
                >
                  {t(`vault_panel.metric.${key}.label`)}
                </OdsText>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 border-t border-[var(--ods-color-neutral-100)] sm:grid-cols-2">
            {ATTR_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-3 p-6">
                <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-semibold">
                  {t(`vault_panel.attr.${key}.title`)}
                </OdsText>
                <OdsText
                  preset={ODS_TEXT_PRESET.caption}
                  className="text-[var(--ods-color-neutral-500)]"
                >
                  {t(`vault_panel.attr.${key}.text`)}
                </OdsText>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
