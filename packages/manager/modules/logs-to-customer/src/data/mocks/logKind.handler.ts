import { Handler } from '@ovh-ux/manager-core-test-utils';
import { apiUrlMocks } from '../../test-utils/test.constant';
import { logKindsMock } from './logKind.mock';

export type GetLogKindsMocksParams = {
  isLogKindsKO?: boolean;
  nbLogKind?: number;
};

export const LogKindsError = 'log kinds error';

export const getLogKindsMocks = ({
  isLogKindsKO,
  nbLogKind = logKindsMock.length,
}: GetLogKindsMocksParams): Handler[] => [
  {
    url: apiUrlMocks.logKind,
    response: isLogKindsKO
      ? { message: LogKindsError }
      : logKindsMock.slice(0, nbLogKind),
    status: isLogKindsKO ? 500 : 200,
    api: 'v2',
  },
];
