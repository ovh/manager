import {
  useOvhTracking,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import { useMemo } from 'react';

export function withTrackClick<CallBack extends (...ars: unknown[]) => unknown>(
  trackClick: ReturnType<typeof useOvhTracking>['trackClick'],
  trackingParams:
    | TrackingClickParams
    | ((...params: Parameters<CallBack>) => TrackingClickParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  return (...params: Parameters<CallBack>): ReturnType<CallBack> => {
    trackClick(
      typeof trackingParams === 'function'
        ? trackingParams(...params)
        : trackingParams,
    );
    return callback?.call(null, ...params) as ReturnType<CallBack>;
  };
}

export function useTrackClick<CallBack extends (...ars: unknown[]) => unknown>(
  trackingParams:
    | TrackingClickParams
    | ((...params: Parameters<CallBack>) => TrackingClickParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  const { trackClick } = useOvhTracking();

  return useMemo(() => withTrackClick(trackClick, trackingParams, callback), [
    trackClick,
    trackingParams,
    callback,
  ]);
}
