import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { okmsMock } from '../kms/okms.mock';

export const kmsIamMock: IamCheckResponse[] = [
  {
    urn: okmsMock[0].iam.urn,
    authorizedActions: [...Object.values(kmsIamActions)],
    unauthorizedActions: [],
  },
];
