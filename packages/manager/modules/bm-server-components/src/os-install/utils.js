const HARDWARE_RAID_NOT_AVAILABLE = 'Not available from this location';
const HARDWARE_RAID_NOT_SUPPORTED = 'Hardware RAID is not supported by this server';

export default class BmServerComponentsOsInstallUtils {
  static toBytes(size) {
    let multiplicator = 1;
    switch (size.unit) {
      case 'KB':
        multiplicator = 1024;
        break;
      case 'MB':
        multiplicator = Math.pow(1024, 2);
        break;
      case 'GB':
        multiplicator = Math.pow(1024, 3);
        break;
      case 'TB':
        multiplicator = Math.pow(1024, 4);
        break;
      case 'PB':
        multiplicator = Math.pow(1024, 5);
        break;
      case 'EB':
        multiplicator = Math.pow(1024, 6);
        break;
      case 'YB':
        multiplicator = Math.pow(1024, 7);
        break;
      default:
        break;
    }
    return size.value * multiplicator;
  }

  static isHardRaidLocationError(error) {
    return (
      error.status === 403 &&
      error.data &&
      error.data.message === HARDWARE_RAID_NOT_AVAILABLE
    );
  }

  static isHardRaidUnavailableError(error) {
    return (
      error.status === 403 &&
      error.data &&
      error.data.message === HARDWARE_RAID_NOT_SUPPORTED
    );
  }
}
