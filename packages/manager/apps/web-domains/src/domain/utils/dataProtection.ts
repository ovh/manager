import {
  DataProtectionFieldEnum,
  DataProtectionStatus,
  DisclosureConfigurationEnum,
  TContactDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import { contactTypeTranslationKeys } from '../constants/serviceDetail';

export const dataProtectionStatus = (
  domainResource: TDomainResource,
): DataProtectionStatus => {
  const contacts: TContactDetails[] = Object.values(
    domainResource?.currentState?.contactsConfiguration || {},
  );

  if (contacts.length === 0) {
    return DataProtectionStatus.NONE;
  }

  if (
    contacts.some(
      (contact) => contact.disclosurePolicy?.forcedDisclosureConfiguration,
    )
  ) {
    return DataProtectionStatus.DISABLED;
  }

  const visibleContacts = contacts.filter(
    (contact) => contact.disclosurePolicy?.visibleViaRdds,
  );

  const redactedContacts = visibleContacts.filter(
    (contact) =>
      contact.disclosurePolicy?.disclosureConfiguration ===
      DisclosureConfigurationEnum.REDACTED,
  );

  if (visibleContacts.length === 0 || redactedContacts.length === 0) {
    return DataProtectionStatus.NONE;
  }

  return redactedContacts.length === visibleContacts.length
    ? DataProtectionStatus.ACTIVE
    : DataProtectionStatus.PARTIAL;
};

export const translateContactType = (
  domainResource: TDomainResource,
): Record<string, string> => {
  const contacts = domainResource?.currentState?.contactsConfiguration || {};
  const result: Record<string, string> = {};

  Object.keys(contacts).forEach((contactKey) => {
    if (contactTypeTranslationKeys[contactKey]) {
      result[contactKey] = contactTypeTranslationKeys[contactKey];
    }
  });

  return result;
};

export const translateContactField = {
  [DataProtectionFieldEnum.ADDRESS]:
    'domain_tab_general_information_data_drawer_contact_field_address',
  [DataProtectionFieldEnum.CITY]:
    'domain_tab_general_information_data_drawer_contact_field_city',
  [DataProtectionFieldEnum.COUNTRY]:
    'domain_tab_general_information_data_drawer_contact_field_country',
  [DataProtectionFieldEnum.EMAIL]:
    'domain_tab_general_information_data_drawer_contact_field_email',
  [DataProtectionFieldEnum.FAX]:
    'domain_tab_general_information_data_drawer_contact_field_fax',
  [DataProtectionFieldEnum.NAME]:
    'domain_tab_general_information_data_drawer_contact_field_name',
  [DataProtectionFieldEnum.ORGANISATION]:
    'domain_tab_general_information_data_drawer_contact_field_organization',
  [DataProtectionFieldEnum.PHONE]:
    'domain_tab_general_information_data_drawer_contact_field_phone',
  [DataProtectionFieldEnum.PROVINCE]:
    'domain_tab_general_information_data_drawer_contact_field_province',
  [DataProtectionFieldEnum.ZIP]:
    'domain_tab_general_information_data_drawer_contact_field_zip',
};
