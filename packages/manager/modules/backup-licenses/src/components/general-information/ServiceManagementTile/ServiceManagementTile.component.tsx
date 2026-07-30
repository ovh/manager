import React from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { CustomerContact } from '@ovh-ux/manager-module-common-api';
import { LinkType, Links, ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';

import ContactsList from '@/components/general-information/ContactsList/ContactsList.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { subRoutes } from '@/routes/routes.constants';

export type ServiceManagementTileProps = {
  creationDate?: string;
  nextBillingDate?: string;
  contacts?: CustomerContact[];
  resourceName?: string;
  isLoading: boolean;
};

/** Format de date de l'exemple du ticket (« 15 April 2027 »), cf. §5 de la spec. */
const DATE_FORMAT = 'd MMMM yyyy';

/**
 * Colonne droite de l'onglet « General information » (BKP-1226) : dates de facturation,
 * contacts, et résiliation.
 */
export default function ServiceManagementTile({
  creationDate,
  nextBillingDate,
  contacts,
  resourceName,
  isLoading,
}: ServiceManagementTileProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION);
  const formatDate = useFormatDate();
  const terminateHref = useHref(subRoutes.terminate);

  return (
    <ManagerTile className="flex-1">
      <ManagerTile.Title>{t('tile.service_management')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('field.creation_date')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton className="part-skeleton:max-w-xs" />
          ) : (
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {formatDate({ date: creationDate, format: DATE_FORMAT })}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('field.next_due_date')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton className="part-skeleton:max-w-xs" />
          ) : (
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {formatDate({ date: nextBillingDate, format: DATE_FORMAT })}
            </OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      {!isLoading && <ContactsList contacts={contacts} resourceName={resourceName} />}
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('field.termination')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Links
            className="part-link:text-[var(--ods-color-critical-500)]"
            label={t('field.terminate_link')}
            href={terminateHref}
            type={LinkType.next}
          />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
