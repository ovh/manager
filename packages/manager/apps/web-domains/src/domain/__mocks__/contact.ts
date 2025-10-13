import { CountryCode } from '@ovh-ux/manager-config';
import { LegalFormEnum } from '@/common/enum/common.enum';
import { TDomainContact } from '@/common/types/common.types';

export const domainContactIndividual: TDomainContact = {
  address: {
    country: CountryCode.FR,
    city: 'ROUBAIX',
    zip: '59100',
    line1: '2 Rue Kellermann',
    province: '',
  },
  birthCity: 'ROUBAIX',
  email: 'example@example.com',
  firstName: 'firstname',
  id: 123456,
  language: 'fr_FR',
  lastName: 'lastname',
  legalForm: LegalFormEnum.Individual,
  phone: '+33.612345679',
  cellPhone: '+33.612345679',
};

export const domainContactCorporation: TDomainContact = {
  address: {
    country: CountryCode.FR,
    city: 'ROUBAIX',
    zip: '59100',
    line1: '2 Rue Kellermann',
    province: '',
  },
  birthCity: 'ROUBAIX',
  email: 'example@example.com',
  firstName: 'firstname',
  id: 123456,
  language: 'fr_FR',
  lastName: 'lastname',
  legalForm: LegalFormEnum.Corporation,
  phone: '+33.612345679',
  cellPhone: '+33.612345679',
  organisationName: 'OVHCloud',
  nationalIdentificationNumber: 'FR123456789',
  vat: 'FRVAT123456',
};
