import {
  LOGO_FILE_FORMATS,
  MAX_SIZE_LOGO_FILE,
  MOBILE_OS,
} from './softphone.constants';

export default class SoftphoneController {
  /* @ngInject */
  constructor(softphoneService, $stateParams, $translate, $q, TucToast) {
    this.acceptedFormats = LOGO_FILE_FORMATS;
    this.acceptedFormatsDesc = LOGO_FILE_FORMATS.map((format) =>
      ['image/', format].join(''),
    );
    this.maxSizeLogoFile = MAX_SIZE_LOGO_FILE;
    this.softphoneService = softphoneService;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.$q = $q;
  }

  $onInit() {
    this.constructor.getMobileOperatingSystem();
    this.MOBILE_OS = MOBILE_OS;
    this.guide = {
      title: 'mocked_title',
      url: 'mocked_url',
      external: 'mocked_external',
      name: 'mocked_name',
    };
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

  updateFilesList() {
    if (this.fileModel?.length > 1) {
      this.fileModel.shift();
    }
  }

  applyTheme() {
    let promise;
    const applyTheme = () => {
      return this.softphoneService.putSoftphoneTheme(
        this.billingAccount,
        this.serviceName,
        this.currentTheme,
      );
    };
    if (!this.fileModel) {
      promise = this.$q.resolve(applyTheme());
    } else {
      promise = this.softphoneService
        .uploadDocument(this.fileModel[0])
        .then((url) => {
          this.softphoneService
            .putSoftphoneLogo(
              this.billingAccount,
              this.serviceName,
              this.fileModel[0].infos.name,
              url,
            )
            .then(applyTheme());
        });
    }

    promise.catch((error) =>
      this.TucToast.error(
        this.$translate.instant('telephony_line_softphone_apply_theme_error', {
          errorMessage: error.message,
        }),
      ),
    );
  }
}
