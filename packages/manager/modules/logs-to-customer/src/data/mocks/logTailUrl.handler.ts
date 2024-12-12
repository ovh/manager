import { Handler } from '../../../../../../../playwright-helpers';
import { apiUrlMocks } from '../../test-utils/test.constant';
import { logTailUrlMock } from './logTailUrl.mock';

export type PostLogTailUrlParams = {
  isLogTailUrlKO?: boolean;
};

export const logTailUrlError = 'log tail url error';

export const postLogTailUrlMocks = ({
  isLogTailUrlKO,
}: PostLogTailUrlParams): Handler[] => [
  {
    url: apiUrlMocks.logUrl,
    method: 'post',
    response: isLogTailUrlKO ? { message: logTailUrlError } : logTailUrlMock,
    status: isLogTailUrlKO ? 500 : 200,
    api: 'v2',
  },
];
