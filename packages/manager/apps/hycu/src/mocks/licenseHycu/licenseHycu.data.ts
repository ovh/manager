import { IHycuDetails, LicenseStatus } from '@/type/hycu.details.interface';

export const licensesHycu: IHycuDetails[] = [
  {
    iam: {
      id: '4a26ef55-d46b-4b71-88c8-76ad71b154b4',
      urn:
        'urn:v1:eu:resource:licenseHycu:425802fa-fb70-4b2a-9d5b-ec4de86bb40c',
    },
    comment: '',
    serviceName: '425802fa-fb70-4b2a-9d5b-ec4de86bb40c',
    controllerId: '',
    licenseStatus: LicenseStatus.TO_ACTIVATE,
    expirationDate: '0001-01-01T00:00:00Z',
  },
  {
    iam: {
      id: '06a89efa-cf14-431b-ab84-af5b3913e2ef',
      urn:
        'urn:v1:eu:resource:licenseHycu:c1b7cb4f-6b63-45da-9a8a-f731f1a67b2c',
    },
    comment: '',
    serviceName: 'c1b7cb4f-6b63-45da-9a8a-f731f1a67b2c',
    controllerId: 'test-id',
    licenseStatus: LicenseStatus.ACTIVATED,
    expirationDate: '0001-01-01T00:00:00Z',
  },
];
