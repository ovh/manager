import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES, EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

export type GeneralInformationTileProps = {
  reference?: string;
  serviceName?: string;
  accessUrl?: string;
  /** `resourceStatus === 'CREATING'` du tenant VSPC (cf. §4 de la spec). */
  isProvisioning: boolean;
  isLoading: boolean;
};

/**
 * Colonne gauche de l'onglet « General information » (BKP-1226) : référence, nom du service,
 * et accès VSPC. Ce dernier n'a pas de nouvel appel réseau dédié (§3 de la spec) : `accessUrl`
 * et `isProvisioning` viennent tous deux du tenant VSPC déjà résolu par la cascade du module.
 */
export default function GeneralInformationTile({
  reference,
  serviceName,
  accessUrl,
  isProvisioning,
  isLoading,
}: GeneralInformationTileProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION);

  return (
    <ManagerTile className="flex-1">
      <ManagerTile.Title>{t('tile.general_information')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('field.reference')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton className="part-skeleton:max-w-xs" />
          ) : (
            <OdsText preset={ODS_TEXT_PRESET.span}>{reference ?? EMPTY_VALUE_PLACEHOLDER}</OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('field.service_name')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton className="part-skeleton:max-w-xs" />
          ) : (
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {serviceName ?? EMPTY_VALUE_PLACEHOLDER}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('field.vspc_access')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton className="part-skeleton:max-w-xs" />
          ) : isProvisioning ? (
            <OdsText preset={ODS_TEXT_PRESET.span}>{t('field.vspc_provisioning')}</OdsText>
          ) : accessUrl ? (
            <Links
              label={t('field.vspc_access_link')}
              href={accessUrl}
              target="_blank"
              rel="noopener"
              type={LinkType.external}
            />
          ) : (
            <OdsText preset={ODS_TEXT_PRESET.span}>{EMPTY_VALUE_PLACEHOLDER}</OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
