const TRACKING_DATAGRID_PREFIX = 'datagrid::button';

export const DATAGRID_BUTTON_TRACKING = {
  ADD_STREAM: `${TRACKING_DATAGRID_PREFIX}::add_data_flow_ldp`,
  EDIT_STREAM: `${TRACKING_DATAGRID_PREFIX}::edit_data_flow_ldp`,
  WATCH_GRAYLOG: `${TRACKING_DATAGRID_PREFIX}::graylog_observe_ldp`,
  COPY_TOKEN: `${TRACKING_DATAGRID_PREFIX}::copy_token_ldp`,
  FOLLOW_LIVE: `${TRACKING_DATAGRID_PREFIX}::follow_live_ldp`,
  MANAGE_ALERTS: `${TRACKING_DATAGRID_PREFIX}::manage_alerts_ldp`,
  ARCHIVE: `${TRACKING_DATAGRID_PREFIX}::archive_ldp`,
  MANAGE_SUBSCRIPTIONS: `${TRACKING_DATAGRID_PREFIX}::manage_subscriptions_ldp`,
  DELETE: `${TRACKING_DATAGRID_PREFIX}::delete_ldp`,
};

export default {
  DATAGRID_BUTTON_TRACKING,
};
