import { Handler } from '../../../../../../../playwright-helpers';
import { testLogUrl } from '../../test-utils/test.constant';
import { logKindsMock } from './logKind.mock';

export type GetLogKindsMocksParams = {
  baseUrl?: string;
  isLogKindsKO?: boolean;
  nbLogKind?: number;
};

export const LogKindsError = 'log kinds error';

export const getLogKindsMocks = ({
  isLogKindsKO,
  nbLogKind = logKindsMock.length,
}: GetLogKindsMocksParams): Handler[] => [
  {
    url: testLogUrl,
    response: isLogKindsKO
      ? { message: LogKindsError }
      : logKindsMock.slice(0, nbLogKind),
    status: isLogKindsKO ? 500 : 200,
    api: 'v2',
  },
];
