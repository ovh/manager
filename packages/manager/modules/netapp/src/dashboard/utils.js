export const getMaxFilesQuery = (serviceName, volumeId) =>
  // eslint-disable-next-line no-useless-escape
  `\{__name__=~"volume_inode_files_total",service_id="${serviceName}",share_id="${volumeId}"\}`;
export const getUsedFilesQuery = (serviceName, volumeId) =>
  // eslint-disable-next-line no-useless-escape
  `\{__name__=~"volume_inode_files_used",service_id="${serviceName}",share_id="${volumeId}"\}`;
export const getActivesNFSQuery = (serviceName, volumeId) =>
  // eslint-disable-next-line no-useless-escape
  `\{__name__=~"nfs_clients_idle_duration",service_id="${serviceName}",share_id="${volumeId}"\}`;
