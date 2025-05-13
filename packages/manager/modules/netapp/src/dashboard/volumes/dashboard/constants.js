export const REDHAT_COMMAND = 'sudo yum install nfs-utils';
export const UBUNTU_COMMAND = 'sudo apt-get install nfs-common';
export const FOLDER_CREATION = 'sudo mkdir /media/nfs01';

export const PATTERN = /^[a-zA-Z0-9._-]{1,255}$/;

export default {
  REDHAT_COMMAND,
  UBUNTU_COMMAND,
  FOLDER_CREATION,
  PATTERN,
};
