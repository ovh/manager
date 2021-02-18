angular
  .module('managerApp')
  .constant('CLOUD_VOLUME_MAX_SIZE', 4 * 1000) // Should be 10 * 1024 (but API is wrong)
  .constant('CLOUD_VOLUME_MIN_SIZE', 10) // 10 Gio
  .constant('CLOUD_VOLUME_UNLIMITED_QUOTA', -1); // Should be 10 * 1024 (but API is wrong)
