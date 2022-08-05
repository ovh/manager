export const DESCRIPTION_MAX = 50;
export const NAME_PATTERN = /^[a-z0-9_-]+$/i;
export const SIZE_MIN = 10;

const PREFIX_TRACKING_DASHBOARD_PARTITION = 'dashboard::nasha-partitions::';

export const PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE = `${PREFIX_TRACKING_DASHBOARD_PARTITION}add`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE = `${PREFIX_TRACKING_DASHBOARD_PARTITION}delete`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE = `${PREFIX_TRACKING_DASHBOARD_PARTITION}update`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION = `${PREFIX_TRACKING_DASHBOARD_PARTITION}zfs-options`;

export const PREFIX_TRACKING_PARTITION_ACL = 'partition::acl';

export default {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  SIZE_MIN,
  PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE,
  PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE,
  PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE,
  PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION,
  PREFIX_TRACKING_PARTITION_ACL,
};
