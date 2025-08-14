import {
  useOvhTracking,
  TrackingClickParams,
  ButtonType,
  PageLocation,
} from '@ovh-ux/manager-react-shell-client';
import { useMemo } from 'react';

export type TrackActionParams = {
  actionName?: string;
  actionValues?: unknown[];
  buttonType?: Lowercase<TrackingClickParams['buttonType']>;
  location?: Lowercase<TrackingClickParams['location']>;
  actionType?: Lowercase<TrackingClickParams['actionType']>;
};

const mapToTrackingClickParams = ({
  actionName,
  actionValues,
  buttonType,
  location,
  ...rest
}: TrackActionParams): TrackingClickParams => ({
  ...rest,
  actions: [actionName].concat(actionValues ? [actionValues.join('_')] : []),
  buttonType: buttonType as ButtonType,
  location: location as PageLocation,
});

function withTrackAction<CallBack extends (...args: unknown[]) => unknown>(
  trackClick: ReturnType<typeof useOvhTracking>['trackClick'],
  trackingParams:
    | TrackActionParams
    | ((...params: Parameters<CallBack>) => TrackActionParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  return (...params: Parameters<CallBack>): ReturnType<CallBack> => {
    const trackClickParams =
      typeof trackingParams === 'function'
        ? trackingParams(...params)
        : trackingParams;

    trackClick(mapToTrackingClickParams(trackClickParams));
    return callback?.call(null, ...params) as ReturnType<CallBack>;
  };
}

export function useTrackAction<
  CallBack extends (...args: unknown[]) => unknown
>(
  trackingParams:
    | TrackActionParams
    | ((...params: Parameters<CallBack>) => TrackActionParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  const { trackClick } = useOvhTracking();

  return useMemo(() => withTrackAction(trackClick, trackingParams, callback), [
    trackClick,
    trackingParams,
    callback,
  ]);
}
