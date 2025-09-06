const logActionNames = [
  'subscribe_logs_access',
  'unsubscribe_logs_access',
  'add_account_logs_access',
  'add_datastream_logs_access',
  'clear_session_logs_access',
  'pause_logs_access',
  'subscribe_other_account_logs_access',
  'graylog_observe_logs_access',
  'select_kind_logs_access',
  'go_back_logs_access',
  'go_to_detail_logs_access',
  'go_to_order_logs',
] as const;

export type LogsActionName = (typeof logActionNames)[number];

export const LogsActionEnum = Object.fromEntries(
  logActionNames.map((action) => [action, action]),
) as Record<LogsActionName, LogsActionName>;
