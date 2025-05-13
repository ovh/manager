export const VERSION_STATUS = {
  ACTIVE: 'active',
  SOON_DEPRECATED: 'soon_deprecated',
  DEPRECATED: 'deprecated',
  EOL: 'eol',
};

export function getVersionStatus(version) {
  const today = moment();
  if (version.endOfLife && moment(version.endOfLife).isBefore(today))
    return VERSION_STATUS.EOL;
  if (version.endOfSupport)
    return today.isBefore(moment(version.endOfSupport))
      ? VERSION_STATUS.SOON_DEPRECATED
      : VERSION_STATUS.DEPRECATED;
  return VERSION_STATUS.ACTIVE;
}

export default {
  VERSION_STATUS,
  getVersionStatus,
};
