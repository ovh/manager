import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { IframeLoaderPayload, loadIframe, removeIframe } from '@/utils/iframe';
import {
  CHALLENGE_IFRAME_ID,
  IFRAME_STYLE,
  TTL_TO_WAIT_IFRAME_RESPONSE,
} from '@/utils/invisible-challenge.constants';

export type ChallengeApiInterceptorChallengeResponse = {
  challenge_response: string;
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve?: (value: T) => void;
  reject?: (reason?: ChallengeFailureReasons) => void;
};

export enum ChallengeFailureReasons {
  NoIframe,
  Timeout,
}

export class ChallengeApiInterceptor {
  private apiClient: AxiosInstance;

  private iframe: HTMLIFrameElement | null;

  private deferWaitingChallenge: Deferred<unknown> | null;

  private abortTimeout: number;

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
    this.iframe = null;
    this.deferWaitingChallenge = null;
    this.abortTimeout = null;
  }

  public attachMessageListener() {
    window.addEventListener('message', (message: MessageEvent) => this.onIframeMessage(message));
  }

  public loadChallenge(url: string): Promise<unknown> {
    if (this.deferWaitingChallenge) {
      return this.deferWaitingChallenge.promise;
    }

    // alternative to Promise.withResolvers()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
    this.deferWaitingChallenge = {
      promise: null,
      resolve: () => null,
      reject: () => null,
    };
    this.deferWaitingChallenge.promise = new Promise((resolve, reject) => {
      this.deferWaitingChallenge.resolve = resolve;
      this.deferWaitingChallenge.reject = reject;
    });

    // If the iframe is already loaded
    if (this.iframe) {
      // And the payload has not changed, we can re-use it.
      if (this.iframe.src === url) {
        // This iframe is already loaded, go forward to talk with it
        this.onIframeLoaded();
        return this.deferWaitingChallenge.promise;
      }
      // Otherwise we remove the previous one to use a new one
      removeIframe(this.iframe);
      this.iframe = null;
    }
    const payload: IframeLoaderPayload = {
      src: url,
      id: CHALLENGE_IFRAME_ID,
      style: IFRAME_STYLE,
      title: 'Security Challenge - API - Interceptor',
    };

    loadIframe(payload)
      .then((loadEvent: Event) => {
        this.iframe = loadEvent.target as HTMLIFrameElement;

        if (!this.iframe) {
          this.iframe = document.getElementById(CHALLENGE_IFRAME_ID) as HTMLIFrameElement;
        }

        this.onIframeLoaded();
      })
      .catch(() => this.deferWaitingChallenge.reject(ChallengeFailureReasons.NoIframe));

    return this.deferWaitingChallenge.promise;
  }

  private onIframeLoaded() {
    if (!this.iframe) {
      this.abortChallenge(ChallengeFailureReasons.NoIframe);
      return;
    }

    const iframeContentWindow = this.iframe.contentWindow;
    iframeContentWindow.postMessage({ type: 'challengeRequest' }, this.iframe.src);

    // If something went wrong with the iframe communication, schedule a safety aborting
    // process to avoid infinitely wait for an iframe message.
    this.abortTimeout = window.setTimeout(() => {
      this.abortChallenge(ChallengeFailureReasons.Timeout);
    }, TTL_TO_WAIT_IFRAME_RESPONSE);
  }

  private abortChallenge(reason: ChallengeFailureReasons): void {
    console.debug('[ChallengeApiInterceptor] Aborting.');
    this.deferWaitingChallenge.reject(reason);
    this.deferWaitingChallenge = null;

    this.clearAbortTimeoutIfNeeded();
  }

  private clearAbortTimeoutIfNeeded() {
    if (this.abortTimeout) {
      clearTimeout(this.abortTimeout);
      this.abortTimeout = null;
    }
  }

  private resolveWaitingChallenge(challenge: ChallengeApiInterceptorChallengeResponse): void {
    this.deferWaitingChallenge.resolve(challenge);
    this.deferWaitingChallenge = null;

    this.clearAbortTimeoutIfNeeded();
  }

  private onIframeMessage(message: MessageEvent): void {
    if (!this.iframe?.src.startsWith(message.origin) || !message.data?.challenge_response) {
      return;
    }

    this.resolveWaitingChallenge(message.data);
  }

  public resendFirstRequestWithHeaders(
    originalConfig: InternalAxiosRequestConfig,
    challenge: ChallengeApiInterceptorChallengeResponse,
  ): Promise<unknown> {
    // Recreate the request config, and adding to its headers the challenge information (source & response)
    const config: InternalAxiosRequestConfig = { ...originalConfig };
    config.headers.set('X-Challenge-Payload', this.iframe.src);
    config.headers.set('X-Challenge-Response', challenge.challenge_response);
    // Resend the request with the challenge information
    return this.apiClient.request(config);
  }
}
