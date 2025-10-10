import { ErrorMessage, TRACKING_LABELS } from './Error.props';

function getTrackingTypology(error: ErrorMessage) {
  if (error?.status && Math.floor(error.status / 100) === 4) {
    return [401, 403].includes(error.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }

  return TRACKING_LABELS.PAGE_LOAD;
}

export { getTrackingTypology };
