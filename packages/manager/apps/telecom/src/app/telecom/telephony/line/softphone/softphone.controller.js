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
    this.LOGO_FILE_FORMATS = LOGO_FILE_FORMATS;
    this.MAX_SIZE_LOGO_FILE = MAX_SIZE_LOGO_FILE;
    this.SoftphoneService = SoftphoneService;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.$q = $q;
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
        devices: this.SoftphoneService.getDevices(
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
        ({ devices, logo: { url, filename }, currentTheme: { themeId } }) => {
          this.devices = devices;

          this.logoUrl = url;
          this.logoFilename = filename;

          this.currentTheme = themeId;
          this.selectedTheme = this.currentTheme;
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
    this.isUpdatingTheme = true;
    return this.SoftphoneService.putSoftphoneTheme(
      this.billingAccount,
      this.serviceName,
      this.selectedTheme,
    )
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
      )
      .finally(() => {
        this.fetchSoftPhoneInformations();
        this.isUpdatingTheme = false;
      });
  }

  applyLogo() {
    this.isUpdatingLogo = true;
    return this.SoftphoneService.uploadDocument(this.fileModel[0]).then(
      (url) => {
        return this.SoftphoneService.putSoftphoneLogo(
          this.billingAccount,
          this.serviceName,
          this.fileModel[0].infos.name,
          url,
        )
          .then(() =>
            this.TucToast.success(
              this.$translate.instant(
                'telephony_line_softphone_apply_logo_add_success',
              ),
            ),
          )
          .catch((error) =>
            this.TucToast.error(
              this.$translate.instant(
                'telephony_line_softphone_apply_logo_add_error',
                {
                  errorMessage: error.message,
                },
              ),
            ),
          )
          .finally(() => {
            this.fetchSoftPhoneInformations();
            this.fileModel = undefined;
            this.isUpdatingLogo = false;
          });
      },
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
            'telephony_line_softphone_apply_logo_remove_success',
          ),
        ),
      )
      .catch((error) =>
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_softphone_apply_logo_remove_error',
            {
              errorMessage: error.message,
            },
          ),
        ),
      )
      .finally(() => {
        this.fetchSoftPhoneInformations();
      });
  }

  helpTextForLogo() {
    return `${this.LOGO_FILE_FORMATS} (< ${this.MAX_SIZE_LOGO_FILE / 1000} KB)`;
  }
}
