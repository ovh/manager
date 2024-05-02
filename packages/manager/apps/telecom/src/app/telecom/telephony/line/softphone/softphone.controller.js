import { MOBILE_OS } from './softphone.constants';

export default class SoftphoneController {
  $onInit() {
    this.constructor.getMobileOperatingSystem();
    this.MOBILE_OS = MOBILE_OS;
  }

  static getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      this.osName = MOBILE_OS.windows;
      return;
    }
    if (/android/i.test(userAgent)) {
      this.osName = MOBILE_OS.android;
      return;
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      this.osName = MOBILE_OS.ios;
      return;
    }
    this.osName = MOBILE_OS.windows;
  }
}
