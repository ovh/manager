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
export const GDPR_FEATURES_CONFIRM_BANNER_CONTAINER =
  'gdpr-features-confirm.alerts.global';

export const CREATE_ERASURE_REQUEST_MESSAGES_MAP = {
  400: 'gdpr_erasure_creation_error',
  429: 'gdpr_erasure_creation_unsuccessful',
  500: 'gdpr_erasure_retryable',
  503: 'gdpr_erasure_retryable',
};

export const CANCEL_ERASURE_REQUEST_MESSAGES_MAP = {
  400: 'gdpr_erasure_cancel_error_missing_nic_or_invalid_request',
  404: 'gdpr_erasure_cancel_already_cancelled',
  409: 'gdpr_erasure_cancel_no_longer_possible',
  500: 'gdpr_erasure_retryable',
  503: 'gdpr_erasure_retryable',
};

export const CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP = {
  400: 'gdpr_erasure_confirmation_email_error_bad_request',
  404: 'gdpr_erasure_confirmation_email_error_not_found',
  409: 'gdpr_erasure_confirmation_email_error_invalid_status',
  429: 'gdpr_erasure_confirmation_email_error_max_attempts',
  500: 'gdpr_erasure_retryable',
  503: 'gdpr_erasure_retryable',
};

export const CONFIRM_ERASURE_REQUEST_MESSAGES_MAP = {
  400: 'gdpr_erasure_confirm_error_invalid_code',
  404: 'gdpr_erasure_cancel_error_missing_nic_or_invalid_request',
  409: 'gdpr_erasure_confirm_error_exhausted_attempts',
  500: 'gdpr_erasure_retryable',
  503: 'gdpr_erasure_retryable',
};

export const ERASURE_REQUEST_STATUS_MESSAGES_COLORS_MAP = {
  blocked: {
    MESSAGE: 'gdpr_erasure_request_status_blocked',
    COLOR: 'oui-badge_error',
  },
  cancelled: {
    MESSAGE: 'gdpr_erasure_request_status_cancelled',
    COLOR: 'oui-badge_warning',
  },
  completed: {
    MESSAGE: 'gdpr_erasure_request_status_completed',
    COLOR: 'oui-badge_success',
  },
  confirm_verification_code: {
    MESSAGE: 'gdpr_erasure_request_status_confirm_verification_code',
    COLOR: 'oui-badge_info',
  },
  in_progress: {
    MESSAGE: 'gdpr_erasure_request_status_in_progress',
    COLOR: 'oui-badge_info',
  },
};

export const ERASURE_INELIGIBILITY_REASON_MESSAGES_MAP = {
  services_estimate: 'gdpr_erasure_request_reason_pending_processing',
  services_operation: 'gdpr_erasure_request_reason_active_services',
  services_subscription: 'gdpr_erasure_request_reason_active_services',
  services_saving_plan: 'gdpr_erasure_request_reason_active_services',
  balance_credit: 'gdpr_erasure_request_reason_credit_balance',
  balance_debit: 'gdpr_erasure_request_reason_debit_balance',
  active_support_ticket: 'gdpr_erasure_request_reason_open_ticket',
  request_cancelled: 'gdpr_erasure_request_reason_cancelled',
  services_orders: 'gdpr_erasure_request_reason_pending_processing',
  services_todo: 'gdpr_erasure_request_reason_pending_processing',
  multiple_reasons: 'gdpr_erasure_request_reason_pending_processing',
};

const rootSupportUrl = 'https://help.ovhcloud.com/';

export const SUPPORT_URLS = {
  viewTickets: `${rootSupportUrl}csm?id=csm_cases_requests&ovhSubsidiary=`,
};

export default {
  GDPR_REQUEST_MANAGEMENT_ACTIONS,
  CREATE_ERASURE_REQUEST_ACTION,
  GDPR_FEATURES_BANNER_CONTAINER,
  GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
  CREATE_ERASURE_REQUEST_MESSAGES_MAP,
  ERASURE_REQUEST_STATUS_MESSAGES_COLORS_MAP,
  ERASURE_INELIGIBILITY_REASON_MESSAGES_MAP,
  SUPPORT_URLS,
};
