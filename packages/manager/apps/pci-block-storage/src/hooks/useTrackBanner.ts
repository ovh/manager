import {
  useOvhTracking,
  TrackingPageParams as MRCTrackinPageParams,
  PageType,
  usePageTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useMemo } from 'react';

export type TrackingBannerParams = {
  type?: 'success' | 'error' | 'warning' | 'info';
};

const mapToMRCTrackinPageParams = (pageName?: string) => ({
  type,
}: TrackingBannerParams): MRCTrackinPageParams => ({
  pageType: type ? (`banner-${type}` as PageType) : undefined,
  pageName,
});

export function withTrackBanner<
  CallBack extends (...args: unknown[]) => unknown
>(
  trackPage: ReturnType<typeof useOvhTracking>['trackPage'],
  pageName: string,
  trackingParams:
    | TrackingBannerParams
    | ((...params: Parameters<CallBack>) => TrackingBannerParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  return (...params: Parameters<CallBack>): ReturnType<CallBack> => {
    const trackBannerParams =
      typeof trackingParams === 'function'
        ? trackingParams(...params)
        : trackingParams;

    trackPage(mapToMRCTrackinPageParams(pageName)(trackBannerParams));
    return callback?.call(null, ...params) as ReturnType<CallBack>;
  };
}

export function useTrackBanner<
  CallBack extends (...args: unknown[]) => unknown
>(
  trackingParams:
    | TrackingBannerParams
    | ((...params: Parameters<CallBack>) => TrackingBannerParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  const { trackPage } = useOvhTracking();
  const pageTracking = usePageTracking();

  return useMemo(
    () =>
      withTrackBanner(
        trackPage,
        pageTracking?.pageName,
        trackingParams,
        callback,
      ),
    [trackPage, pageTracking?.pageName, trackingParams, callback],
  );
}
