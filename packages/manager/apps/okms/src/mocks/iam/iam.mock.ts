import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { okmsMock } from '../kms/okms.mock';
import { serviceKeyMock } from '../serviceKeys/serviceKeys.mock';

export const kmsIamMock: IamCheckResponse[] = [
  {
    urn: okmsMock[0].iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
  {
    urn: serviceKeyMock[0].iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
  {
    urn: secretListMock[0].iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
];
