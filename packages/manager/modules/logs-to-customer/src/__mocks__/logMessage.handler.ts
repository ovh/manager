import { Handler } from '@ovh-ux/manager-core-test-utils';

import { logMessagesMock } from '@/__mocks__/logMessage.mock';
import { logTailUrlMock } from '@/__mocks__/logTailUrl.mock';
import { TGetLogTailMessagesResponse } from '@/data/api/logTailMessages';

export type GetLogMessageParams = {
  isLogMessagesKO?: boolean;
  isLogMessagesOnce?: boolean;
};

export const logMessagesError = 'log message error';

export const getLogMessageMocks = ({
  isLogMessagesKO,
  isLogMessagesOnce = false,
}: GetLogMessageParams): Handler[] => {
  const responseMock = logMessagesMock.map((message) => ({
    message,
  }));

  // For absolute URLs starting with http/https, we split into baseUrl + path
  // so toMswHandlers can construct the full URL correctly
  const isAbsoluteUrl = logTailUrlMock.url.startsWith('http');
  let baseUrl: string | undefined;
  let url: string;

  if (isAbsoluteUrl) {
    // Extract base URL and path: 'https://domain.com/path' -> base: 'https://domain.com', path: '/path'
    const urlObj = new URL(logTailUrlMock.url);
    baseUrl = urlObj.origin;
    url = urlObj.pathname + urlObj.search + urlObj.hash;
  } else {
    baseUrl = undefined;
    url = logTailUrlMock.url;
  }

  return [
    {
      url,
      method: 'get',
      response: isLogMessagesKO
        ? { message: logMessagesError }
        : ({ messages: responseMock } as TGetLogTailMessagesResponse),
      status: isLogMessagesKO ? 500 : 200,
      type: isLogMessagesKO ? ('error' as ResponseType) : ('default' as ResponseType),
      baseUrl,
      once: isLogMessagesOnce,
      delay: 0,
    },
  ];
};
