const TRACKING_TAB_PREFIX = 'go-to-tab';

export const TRACKING_HITS = {
  SUBHOME_TAB: `${TRACKING_TAB_PREFIX}::subhome_ldp`,
  DASHBOARD_TAB: `${TRACKING_TAB_PREFIX}::dashboard_ldp`,
  COLLECTION_TOOLS_TAB: `${TRACKING_TAB_PREFIX}::collection_tools_ldp`,
  ALIAS_TAB: `${TRACKING_TAB_PREFIX}::alias_ldp`,
  OPENSEARCH_DASHBOARDS: `${TRACKING_TAB_PREFIX}::opensearch-dashboard_ldp`,
  ROLES: `${TRACKING_TAB_PREFIX}::roles_ldp`,
  DATA_STREAM: `${TRACKING_TAB_PREFIX}::data-stream_ldp`,
  INDEX_TAB: `${TRACKING_TAB_PREFIX}::index_ldp`,
};

export default {
  TRACKING_HITS,
};
