import { LogsActionName } from '@ovh-ux/logs-to-customer/src/types/logsTracking';

export const trackClickMap: Record<LogsActionName, string[]> = {
  subscribe_logs_access: ['subscribe_logs_access_kms'],
  unsubscribe_logs_access: ['unsubscribe_logs_access_kms'],
  add_account_logs_access: ['add_account_logs_access_kms'],
  add_datastream_logs_access: ['add_datastream_logs_access_kms'],
  clear_session_logs_access: ['clear_session_logs_access_kms'],
  pause_logs_access: ['pause_logs_access_kms'],
  subscribe_other_account_logs_access: [
    'subscribe_other_account_logs_access_kms',
  ],
  graylog_observe_logs_access: ['graylog_observe_logs_access_kms'],
  select_kind_logs_access: ['select_kind_logs_access_kms'],
  go_back_logs_access: ['go_back_logs_access_kms'],
  go_to_detail_logs_access: ['go_to_detail_logs_access_kms'],
};
