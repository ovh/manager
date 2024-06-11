import {
  GUIDE_URL,
  LOGO_FILE_FORMATS,
  MAX_SIZE_LOGO_FILE,
  MOBILE_OS,
  STATUS_SOFTPHONE,
} from './softphone.constants';

export default class SoftphoneController {
  /* @ngInject */
  constructor(softphoneService, $translate, $q, TucToast) {
    this.acceptedFormats = LOGO_FILE_FORMATS;
    this.acceptedFormatsDesc = LOGO_FILE_FORMATS.map((format) =>
      ['image/', format].join(''),
    );
    this.maxSizeLogoFile = MAX_SIZE_LOGO_FILE;
    this.softphoneService = softphoneService;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.$q = $q;
    this.showEditFormSoftphoneName = {};
    this.model = {};
    this.softphoneNameForm = {};
    this.STATUS_SOFTPHONE = STATUS_SOFTPHONE;
  }

  $onInit() {
    this.getMobileOperatingSystem();
    this.MOBILE_OS = MOBILE_OS;
    this.guide = {
      title: 'telephony_line_softphone_configure_title',
      url: GUIDE_URL,
      external: true,
    };
    this.isLoading = true;
    this.softphoneService
      .getDevicesInfos(this.billingAccount, this.serviceName)
      .then((devices) => {
        this.devices = devices;
        this.isLoading = false;
      });
  }

  saveSoftphoneName(deviceId) {
    this.showEditFormSoftphoneName[deviceId] = false;
    this.softphoneService
      .modifyDevice(
        this.billingAccount,
        this.serviceName,
        this.model[deviceId].name,
        deviceId,
      )
      .then(() => {
        this.isLoading = true;
        this.softphoneService
          .getDevicesInfos(this.billingAccount, this.serviceName)
          .then((devices) => {
            this.isLoading = false;
            this.devices = devices;
          });
      })
      .catch((error) =>
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_softphone_change_name_error',
            {
              errorMessage: error.message,
            },
          ),
        ),
      );
  }

  toggleEditSoftphoneName(deviceId) {
    this.showEditFormSoftphoneName[deviceId] = !this.showEditFormSoftphoneName[
      deviceId
    ];
  }

  getMobileOperatingSystem() {
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

    promise
      .then(() =>
        this.TucToast.success(
          this.$translate.instant(
            'telephony_line_softphone_apply_theme_success',
          ),
        ),
      )
      .catch((error) =>
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_softphone_apply_theme_error',
            {
              errorMessage: error.message,
            },
          ),
        ),
      );
  }
}
