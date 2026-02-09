import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';

import { IamCheckResponse } from '@ovh-ux/muk';

import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { okmsRoubaix1Mock } from '../kms/okms.mock';
import { serviceKeyMock1 } from '../service-keys/serviceKeys.mock';

export const kmsIamMock: IamCheckResponse[] = [
  {
    urn: okmsRoubaix1Mock.iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
  {
    urn: serviceKeyMock1.iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
  {
    urn: mockSecret1.iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
];
