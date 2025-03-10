import { IAM_LOGS_AUDIT_TRACKING_PREFIX } from '../../logs.constants';

export const IAM_DATA_STREAMS_TRACKING_HITS = {
  AUDIT: {
    LISTING_PAGE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}logs_subscriptions`,
    ADD_DATA_STREAM: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::add_datastream_logs_datastream`,
    GO_BACK: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::link::go_back_logs_datastream`,
    LDP_DETAIL: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}datagrid::button::go-to-detail_logs_datastream`,
    SUBSCRIBE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}datagrid::button::subscribe_logs_datastream`,
    UNSUBSCRIBE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}datagrid::button::unsubscribe_logs_datastream`,
  },
};
