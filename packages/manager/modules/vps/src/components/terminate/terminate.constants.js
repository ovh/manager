export const TRACKING_PREFIX = 'vps::detail::terminate-option';

export const TITLES = {
  additionalDisk: 'vps_configuration_cancel_option_title_additionaldisk',
  automatedBackup: 'vps_configuration_cancel_option_title_automatedbackup',
  ftpBackup: 'vps_configuration_cancel_option_title_ftpbackup',
  snapshot: 'vps_configuration_cancel_option_title_snapshot',
  veeam: 'vps_configuration_cancel_option_title_veeam',
  windows: 'vps_configuration_cancel_option_title_windows',
};

export const TERMINATE_INFO = {
  additionalDisk: 'vps_additional_disk_terminate_info_part_1',
  automatedBackup: 'vps_configuration_cancel_option_step1_info',
  ftpBackup: 'vps_configuration_cancel_option_step1_info',
  snapshot: 'vps_configuration_cancel_option_step1_info',
  veeam: 'vps_configuration_cancel_option_step1_info',
  windows: 'vps_configuration_cancel_option_step1_info',
};

export const TERMINATE_SUCCESS_INFO = {
  additionalDisk: 'vps_additional_disk_terminate_action_terminate_success',
  automatedBackup: 'vps_configuration_cancel_option_cancel_success',
  ftpBackup: 'vps_configuration_cancel_option_cancel_success',
  snapshot: 'vps_configuration_cancel_option_cancel_success',
  veeam: 'vps_configuration_cancel_option_cancel_success',
  windows: 'vps_configuration_cancel_option_cancel_success',
};

export const TRACKING_INFO = {
  automatedBackup: 'backup-auto',
  snapshot: 'snapshot',
};

export default {
  TRACKING_PREFIX,
  TITLES,
  TRACKING_INFO,
  TERMINATE_SUCCESS_INFO,
};
