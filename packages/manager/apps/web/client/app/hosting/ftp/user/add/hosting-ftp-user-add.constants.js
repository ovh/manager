export const PROTOCOL_CHOICES = {
  ftp: 'ftp',
  ftpAndSftp: 'both',
  all: 'all',
};
export const SSH_MODEL_PROTOCOL = {
  ftp: 'none',
  both: 'sftponly',
  all: 'active',
  DEFAULT: 'none',
};

export default {
  SSH_MODEL_PROTOCOL,
  PROTOCOL_CHOICES,
};
