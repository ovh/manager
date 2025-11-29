import { useMemo } from 'react';

import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

export type TrackActionParams = {
  actionName?: string;
  actionValues?: unknown[];
  buttonType?: Lowercase<NonNullable<TrackingClickParams['buttonType']>>;
  location?: Lowercase<NonNullable<TrackingClickParams['location']>>;
  actionType?: Lowercase<NonNullable<TrackingClickParams['actionType']>>;
};

const mapToTrackingClickParams = ({
  actionName,
  actionValues,
  buttonType,
  location,
  ...rest
}: TrackActionParams): TrackingClickParams => {
  const baseActions = actionName ? [actionName] : [];
  const additionnalActions = actionValues ? [actionValues.join('_')] : [];

  return {
    ...rest,
    actions: baseActions.concat(additionnalActions),
    buttonType: buttonType as ButtonType,
    location: location as PageLocation,
  };
};

function withTrackAction<CallBack extends (...args: unknown[]) => unknown>(
  trackClick: ReturnType<typeof useOvhTracking>['trackClick'],
  trackingParams: TrackActionParams | ((...params: Parameters<CallBack>) => TrackActionParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  return (...params: Parameters<CallBack>): ReturnType<CallBack> => {
    const trackClickParams =
      typeof trackingParams === 'function' ? trackingParams(...params) : trackingParams;

    trackClick(mapToTrackingClickParams(trackClickParams));
    return callback?.call(null, ...params) as ReturnType<CallBack>;
  };
}

export function useTrackAction<CallBack extends (...args: any[]) => unknown>(
  trackingParams: TrackActionParams | ((...params: Parameters<CallBack>) => TrackActionParams),
  callback?: CallBack,
): (...params: Parameters<CallBack>) => ReturnType<CallBack> {
  const { trackClick } = useOvhTracking();

  return useMemo(
    () => withTrackAction(trackClick, trackingParams, callback),
    [trackClick, trackingParams, callback],
  );
}
