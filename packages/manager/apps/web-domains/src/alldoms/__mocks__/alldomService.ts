import { AlldomService } from '@/alldoms/types';
import {
  DomainRegistrationStateEnum,
  ServiceInfoType,
} from '@/alldoms/enum/service.enum';

export const alldomService: AlldomService = {
  currentState: {
    name: 'alldom-french-international-example',
    type: ServiceInfoType.French,
    domains: [
      {
        name: 'alldom-french-international-example.be',
        registrationStatus: DomainRegistrationStateEnum.Registered,
        expiresAt: '2025-10-10T18:48:22+02:00',
        extension: 'be',
      },
      {
        name: 'alldom-french-international-example.eu',
        registrationStatus: DomainRegistrationStateEnum.Registered,
        expiresAt: '2025-10-10T23:59:59+02:00',
        extension: 'eu',
      },
      {
        name: 'alldom-french-international-example.fr',
        registrationStatus: DomainRegistrationStateEnum.Registered,
        expiresAt: '2025-10-01T18:59:40+02:00',
        extension: 'fr',
      },
    ],
    extensions: ['be', 'eu', 'fr'],
  },
  nicAdmin: 'aa00001-ovh',
  nicBilling: 'aa00001-ovh',
  nicTechnical: 'aa00001-ovh',
  pendingActions: [],
  renewMode: null,
  creationDate: '',
  expirationDate: '',
  renewalDate: '',
  serviceId: 1,
};
