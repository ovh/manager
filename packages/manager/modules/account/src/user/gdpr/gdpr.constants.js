export const CREATE_ERASURE_REQUEST_ACTION =
  'account:apiovh:me/privacy/requests/erasure/create';

export const GDPR_REQUEST_MANAGEMENT_ACTIONS = [
  {
    name: 'account:apiovh:me/privacy/requests/get',
    mandatory: true,
  },
  {
    name: 'account:apiovh:me/privacy/requests/capabilities/get',
    mandatory: true,
  },
  {
    name: CREATE_ERASURE_REQUEST_ACTION,
    mandatory: false,
  },
];

export const GDPR_FEATURES_BANNER_CONTAINER = 'gdpr-features.alerts.global';

export const CREATE_ERASURE_REQUEST_MESSAGES_MAP = {
  400: 'gdpr_erasure_creation_error',
  429: 'gdpr_erasure_creation_unsuccessful',
  500: 'gdpr_erasure_creation_retryable',
  503: 'gdpr_erasure_creation_retryable',
};

export default {
  GDPR_REQUEST_MANAGEMENT_ACTIONS,
  CREATE_ERASURE_REQUEST_ACTION,
  GDPR_FEATURES_BANNER_CONTAINER,
  CREATE_ERASURE_REQUEST_MESSAGES_MAP,
};
