import { LicenseType } from '../license/type';

export const licensesMock: LicenseType[] = [
  {
    address: '1234 Main St',
    city: 'Paris',
    creationDate: '2020-01-15T12:00:00+02:00',
    displayName: 'user123.o365.ovh.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '0033123456789',
    serviceName: 'user123.o365.ovh.com',
    serviceType: 'payAsYouGo',
    status: 'active',
    zipCode: '75001',
    iam: {
      id: '12345abc-6789-def0-gh12-3456789ijklm',
      urn: 'urn:v1:eu:resource:licenseOffice:user123.o365.ovh.com',
    },
  },
  {
    address: '12345 Main St',
    city: 'Lille',
    creationDate: '2020-01-15T12:00:00+02:00',
    displayName: 'user123.o365.ovh.com',
    firstName: 'Test',
    lastName: 'Test',
    phone: '0033123456789',
    serviceName: 'topuser125.o365.ovh.com',
    serviceType: 'payAsYouGo',
    status: 'active',
    zipCode: '59000',
    iam: {
      id: '12345abc-6789-def0-gh12-3456789ijklm',
      urn: 'urn:v1:eu:resource:licenseOffice:user123.o365.ovh.com',
    },
  },
];
