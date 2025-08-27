import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';
import {
  ChallengeApiInterceptor,
  ChallengeApiInterceptorChallengeResponse,
  ChallengeFailureReasons,
} from '@/utils/invisible-challenge.class';
import { INVISIBLE_CHALLENGE_ERROR_CLASS } from '@/utils/invisible-challenge.constants';

export const initInterceptor = () => {
  const challengeApiInterceptor = new ChallengeApiInterceptor(v6);
  challengeApiInterceptor.attachMessageListener();

  type ResponseWithChallenge = {
    class?: string;
    body?: {
      type: 'image' | 'url';
      payload: string;
    };
  };

  v6.interceptors.response.use(undefined, (error : Record<string, any>) => {
    const { response } = error || {};
    const { status, data } = response;

    if (status === 400 && data.class === INVISIBLE_CHALLENGE_ERROR_CLASS) {
      const {
        body: { payload },
      } = data as ResponseWithChallenge;
      if (!payload) {
        // This should not happen. (API bug)
        console.warn(
          '[ChallengeApiInterceptor] missing payload in the challenge response body.',
        );
        return Promise.reject(data);
      }

      return challengeApiInterceptor
        .loadChallenge(payload)
        .then((challenge: ChallengeApiInterceptorChallengeResponse) =>
          challengeApiInterceptor.resendFirstRequestWithHeaders(
            error.config,
            challenge,
          ),
        )
        .catch((reason: AxiosError | ChallengeFailureReasons) => {
          console.warn(
            '[ChallengeApiInterceptor] Unable to get the API challenge.',
          );
          if (reason instanceof AxiosError) {
            return Promise.reject(reason);
          }
          // @ts-ignore
          const fullError: Error = { ...error, reason };
          return Promise.reject(fullError);
        });
    }

    return Promise.reject(error);
  });
};

export default initInterceptor;
