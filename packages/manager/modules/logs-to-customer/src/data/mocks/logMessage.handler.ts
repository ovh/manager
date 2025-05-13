import { delay, http, HttpResponse, RequestHandler } from 'msw';
import { logMessagesMock } from './logMessage.mock';
import { logTailUrlMock } from './logTailUrl.mock';
import { TGetLogTailMessagesResponse } from '../api/logTailMessages';

export type GetLogMessageParams = {
  isLogMessagesKO?: boolean;
  isLogMessagesOnce?: boolean;
};

export const logMessagesError = 'log message error';

export const getLogMessageMocks = ({
  isLogMessagesKO,
  isLogMessagesOnce = false,
}: GetLogMessageParams): RequestHandler => {
  const responseMock = logMessagesMock.map((message) => ({
    message,
  }));

  return http.get(
    logTailUrlMock.url,
    async () => {
      await delay();

      const json = isLogMessagesKO
        ? { message: logMessagesError }
        : ({ messages: responseMock } as TGetLogTailMessagesResponse);
      const status = isLogMessagesKO ? 500 : 200;
      const type = isLogMessagesKO ? 'error' : 'default';

      return HttpResponse.json(json, {
        status,
        type,
      });
    },
    { once: isLogMessagesOnce },
  );
};
