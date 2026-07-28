import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsAccordion, OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { getTwoColumnCellBorders } from '@/utils/gridCellBorders/gridCellBorders';

const METRIC_KEYS = ['included', 'overage', 'egress'] as const;
const ATTR_KEYS = ['managed', 'secured', 'scalable', 'pricing'] as const;

/**
 * Encart informatif Vault (étape 3) — purement informatif, non éditable.
 * Replié par défaut et dégradé visuellement (une ligne de synthèse) : sur une étape de
 * configuration, l'attention doit aller aux champs à saisir, pas à un rappel d'offre déjà
 * vu aux étapes précédentes. Le détail (métriques + atouts) reste accessible à la demande.
 *
 * `order__accordion` donne la bordure permanente, qu'ODS ne montre qu'au survol, et sa
 * variante `--flush` annule le retrait latéral du contenu pour que la grille de métriques
 * aille bord à bord. Les deux vivent dans l'`index.scss` de l'app : `::part` n'est pas
 * exprimable en classes utilitaires.
 */
export default function VaultInfoPanel() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <OdsAccordion className="order__accordion order__accordion--flush block">
      <span className="flex min-w-0 flex-col gap-1" slot="summary">
        <span className="flex items-center gap-3">
          <OdsText preset={ODS_TEXT_PRESET.heading6}>{t('vault_panel.title')}</OdsText>
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

      <div>
        {/* Trait de séparation avec l'en-tête : ODS n'en pose pas entre `summary` et `content`. */}
        <div className="flex border-0 border-t border-solid border-[var(--ods-color-neutral-100)] bg-[var(--ods-color-neutral-050)]">
          {METRIC_KEYS.map((key) => (
            <div
              key={key}
              className="flex flex-1 flex-col items-center gap-3 border-0 border-l border-solid border-[var(--ods-color-neutral-100)] p-6 text-center first:border-l-0"
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

        <div className="grid grid-cols-1 border-0 border-t border-solid border-[var(--ods-color-neutral-100)] sm:grid-cols-2">
          {ATTR_KEYS.map((key, index) => (
            <div
              key={key}
              className={`flex flex-col gap-3 p-6 ${getTwoColumnCellBorders(
                index,
                ATTR_KEYS.length,
              )}`}
            >
              <OdsText
                preset={ODS_TEXT_PRESET.paragraph}
                className="font-bold text-[var(--ods-color-neutral-800)]"
              >
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
    </OdsAccordion>
  );
}
