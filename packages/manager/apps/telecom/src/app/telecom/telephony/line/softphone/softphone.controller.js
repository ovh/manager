import {
  GUIDE_URL,
  LOGO_FILE_FORMATS,
  MAX_SIZE_LOGO_FILE,
  MOBILE_OS,
  STATUS_SOFTPHONE,
} from './softphone.constants';

export default class SoftphoneController {
  /* @ngInject */
  constructor(SoftphoneService, $translate, $q, TucToast) {
    this.acceptedFormats = LOGO_FILE_FORMATS;
    this.acceptedFormatsDesc = LOGO_FILE_FORMATS.map((format) =>
      ['image/', format].join(''),
    );
    this.maxSizeLogoFile = MAX_SIZE_LOGO_FILE;
    this.SoftphoneService = SoftphoneService;
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
    this.currentServiceIsActivate = this.softphoneStatus.activation;
    this.hasToggleSwitchActivation =
      this.softphoneStatus.infrastructure === 'LEGACY';

    if (this.currentServiceIsActivate) {
      this.fetchSoftPhoneInformations();
    }
  }

  fetchSoftPhoneInformations() {
    this.isLoading = true;
    this.$q
      .all({
        devicesInfos: this.SoftphoneService.getDevicesInfos(
          this.billingAccount,
          this.serviceName,
        ),
        logo: this.SoftphoneService.getLogo(
          this.billingAccount,
          this.serviceName,
        ),
        currentTheme: this.SoftphoneService.getSoftphoneCurrentTheme(
          this.billingAccount,
          this.serviceName,
        ),
      })
      .then(
        ({
          devicesInfos,
          logo: { url, filename },
          currentTheme: { themeId },
        }) => {
          this.devices = devicesInfos;

          this.logoUrl = url;
          this.logoFilename = filename;

          this.currentTheme = themeId;
        },
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  handleToggleSwitchActivation() {
    this.SoftphoneService.switchActivation(
      this.billingAccount,
      this.serviceName,
      !this.currentServiceIsActivate,
    )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'telephony_line_tab_softphone_activation_message_success',
          ),
        );
        if (this.currentServiceIsActivate) {
          this.fetchSoftPhoneInformations();
        }
      })
      .catch(() => {
        this.currentServiceIsActivate = !this.currentServiceIsActivate;
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_tab_softphone_activation_message_error',
          ),
        );
      });
  }

  saveSoftphoneName(deviceId) {
    this.showEditFormSoftphoneName[deviceId] = false;
    this.SoftphoneService.modifyDevice(
      this.billingAccount,
      this.serviceName,
      this.model[deviceId].name,
      deviceId,
    )
      .then(() => {
        this.isLoading = true;
        this.SoftphoneService.getDevicesInfos(
          this.billingAccount,
          this.serviceName,
        ).then((devices) => {
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
    if (/iPad|iPhone|Macintosh|iPod/.test(userAgent) && !window.MSStream) {
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
      return this.SoftphoneService.putSoftphoneTheme(
        this.billingAccount,
        this.serviceName,
        this.currentTheme,
      );
    };
    if (!this.fileModel) {
      promise = this.$q.resolve(applyTheme());
    } else {
      promise = this.SoftphoneService.uploadDocument(this.fileModel[0]).then(
        (url) => {
          this.SoftphoneService.putSoftphoneLogo(
            this.billingAccount,
            this.serviceName,
            this.fileModel[0].infos.name,
            url,
          ).then(applyTheme());
        },
      );
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

  deleteLogo() {
    this.SoftphoneService.deleteSoftphoneLogo(
      this.billingAccount,
      this.serviceName,
    )
      .then(() =>
        this.TucToast.success(
          this.$translate.instant(
            'telephony_line_softphone_apply_logo_success',
          ),
        ),
      )
      .catch((error) =>
        this.TucToast.error(
          this.$translate.instant('telephony_line_softphone_apply_logo_error', {
            errorMessage: error.message,
          }),
        ),
      );
  }

  helpTextForLogo() {
    return `${this.acceptedFormatsDesc} (< ${this.maxSizeLogoFile / 1000} KB)`;
  }
}
