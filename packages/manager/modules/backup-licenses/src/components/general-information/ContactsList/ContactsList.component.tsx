import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { CustomerContact } from '@ovh-ux/manager-module-common-api';
import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

export type ContactsListProps = {
  contacts?: CustomerContact[];
  /** Sert de `serviceName` à la navigation inter-app vers `account` (cf. §8 de la spec). */
  resourceName?: string;
};

/** Ordre imposé par le ticket/la maquette (§8 de la spec), pas garanti par l'API. */
const CONTACT_ROLE_ORDER: CustomerContact['type'][] = ['administrator', 'technical', 'billing'];

/**
 * Contacts du service + lien de renvoi vers la gestion des contacts (app `account`).
 * Masquée en bloc (lignes + lien) si `customer.contacts` est vide ou absent : le ticket ne
 * documente aucun état vide dédié pour ce cas (§8 de la spec).
 */
export default function ContactsList({ contacts, resourceName }: ContactsListProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION);
  // Paramètres non confirmés côté production pour ce produit (cf. §13 de la spec) : alignés
  // sur le précédent le plus proche trouvé dans le monorepo (web-hosting, même route, même forme
  // { serviceName, category }), à ajuster une fois vérifié.
  const { data: manageContactsUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services',
    { serviceName: resourceName ?? '', category: 'BACKUP_LICENSES' },
  ]);

  if (!contacts?.length) return null;

  const orderedContacts = CONTACT_ROLE_ORDER.map((role) =>
    contacts.find((contact) => contact.type === role),
  ).filter((contact): contact is CustomerContact => !!contact);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('field.contacts')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex flex-col gap-2">
          {orderedContacts.map((contact) => (
            <div key={contact.type} className="flex justify-between gap-4">
              <OdsText preset={ODS_TEXT_PRESET.span}>{contact.customerCode}</OdsText>
              <OdsText preset={ODS_TEXT_PRESET.span}>{t(`contact_role.${contact.type}`)}</OdsText>
            </div>
          ))}
          <Links
            label={t('field.manage_contacts')}
            href={manageContactsUrl as string | undefined}
            isDisabled={!manageContactsUrl}
            type={LinkType.next}
          />
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
}
