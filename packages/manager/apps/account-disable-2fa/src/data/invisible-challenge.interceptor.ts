import { v6 } from '@ovh-ux/manager-core-api';
import {
  ChallengeApiInterceptor,
  ChallengeApiInterceptorChallengeResponse,
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

  v6.interceptors.response.use(undefined, (error) => {
    const { response } = error;
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
        .catch((challengeError) => {
          console.warn(
            '[ChallengeApiInterceptor] Unable to get the API challenge.',
          );
          return Promise.reject(challengeError);
        });
    }

    return Promise.reject(error);
  });
};

export default initInterceptor;
