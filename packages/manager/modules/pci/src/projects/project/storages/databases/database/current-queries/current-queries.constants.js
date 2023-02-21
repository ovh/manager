const CURRENT_QUERIES = 'current_queries';

const IDLE_CONNECTIONS_ENABLE = `${CURRENT_QUERIES}::idle_connections_enable`;

const IDLE_CONNECTIONS_DISABLE = `${CURRENT_QUERIES}::idle_connections_disable`;

const ACTIVE_CONNECTIONS_ENABLE = `${CURRENT_QUERIES}::show_active_connections_enable`;

const ACTIVE_CONNECTIONS_DISABLE = `${CURRENT_QUERIES}::show_active_connections_disable`;

const AUTO_REFRESH_ENABLE = `${CURRENT_QUERIES}::auto_refresh_enable`;

const AUTO_REFRESH_DISABLE = `${CURRENT_QUERIES}::auto_refresh_disable`;

const TERMINATE_QUERY = `${CURRENT_QUERIES}::terminate_query`;

export const TRACKING_INFO = {
  CURRENT_QUERIES,
  IDLE_CONNECTIONS_ENABLE,
  IDLE_CONNECTIONS_DISABLE,
  ACTIVE_CONNECTIONS_ENABLE,
  ACTIVE_CONNECTIONS_DISABLE,
  AUTO_REFRESH_ENABLE,
  AUTO_REFRESH_DISABLE,
  TERMINATE_QUERY,
};

export const IDLE_QUERY_STATES = [
  'IDLE',
  'IDLE_IN_TRANSACTION',
  'IDLE_IN_TRANSACTION_ABORTED',
];

export const ACTIVE_QUERY_STATE = 'ACTIVE';

export default {
  TRACKING_INFO,
  IDLE_QUERY_STATES,
  ACTIVE_QUERY_STATE,
};
