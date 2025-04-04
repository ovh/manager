import {
  GUIDE_URL,
  LOGO_FILE_FORMATS,
  MAX_SIZE_LOGO_FILE,
  MOBILE_OS,
  SOFTPHONE_TRACKING,
  LOGO_BY_DEFAULT,
  DOWNLOAD_URL,
} from './softphone.constants';

export default class SoftphoneController {
  /* @ngInject */
  constructor(SoftphoneService, $translate, $q, TucToast) {
    this.DOWNLOAD_URL = DOWNLOAD_URL;
    this.LOGO_BY_DEFAULT = LOGO_BY_DEFAULT;
    this.LOGO_FILE_FORMATS = LOGO_FILE_FORMATS;
    this.MAX_SIZE_LOGO_FILE = MAX_SIZE_LOGO_FILE;
    this.SOFTPHONE_TRACKING = SOFTPHONE_TRACKING;
    this.SoftphoneService = SoftphoneService;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.$q = $q;
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
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      this.osName = MOBILE_OS.ios;
      return;
    }
    if (/macintosh/.test(userAgent)) {
      this.osName = MOBILE_OS.macos;
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
    this.trackClick(SOFTPHONE_TRACKING.THEME_MANAGEMENT.APPLY);
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

  deleteTheme() {
    this.isUpdatingTheme = true;
    return this.SoftphoneService.deleteSoftphoneTheme(
      this.billingAccount,
      this.serviceName,
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
          .then(() => {
            this.TucToast.success(
              this.$translate.instant(
                'telephony_line_softphone_apply_logo_add_success',
              ),
            );
            this.trackBanner('info', 'success');
          })
          .catch((error) => {
            this.TucToast.error(
              this.$translate.instant(
                'telephony_line_softphone_apply_logo_add_error',
                {
                  errorMessage: error.message,
                },
              ),
            );
            this.trackBanner('error', 'error');
          })
          .finally(() => {
            this.fetchSoftPhoneInformations();
            this.fileModel = undefined;
            this.isUpdatingLogo = false;
          });
      },
    );
  }

  trackBanner(bannerType, returnType) {
    this.trackPage({
      ...SOFTPHONE_TRACKING.LOGO_MANAGEMENT.BANNER,
      name: SOFTPHONE_TRACKING.LOGO_MANAGEMENT.BANNER.name
        .replace(/{{bannerType}}/g, bannerType)
        .replace(/{{returnType}}/g, returnType),
      page: {
        name: SOFTPHONE_TRACKING.LOGO_MANAGEMENT.BANNER.page.name
          .replace(/{{bannerType}}/g, bannerType)
          .replace(/{{returnType}}/g, returnType),
      },
    });
  }

  onCopyDownloadLinkClick(event) {
    // Clipboard has 2 elements input & button. Input event handler triggers click on button.
    // So click event-handler on oui-clipboard will be triggered twice.
    // For the expected behavior, considering only the click event on input element.
    if (event.target.tagName === 'INPUT') {
      this.trackClick(SOFTPHONE_TRACKING.DOWNLOAD.LINK);
    }
  }

  deleteLogo() {
    this.trackClick(SOFTPHONE_TRACKING.LOGO_MANAGEMENT.DELETE);
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
    return this.$translate.instant('telephony_line_softphone_logo_format', {
      format: this.LOGO_FILE_FORMATS,
      weight: `${this.MAX_SIZE_LOGO_FILE / 1000000} ${this.$translate.instant(
        'ua_unit_size_MB',
      )}`,
      size: '512x512',
    });
  }

  goStoreTrackClick(store) {
    this.trackClick({
      ...SOFTPHONE_TRACKING.DOWNLOAD.STORE,
      name: SOFTPHONE_TRACKING.DOWNLOAD.STORE.name.replace(
        /{{storeName}}/g,
        store,
      ),
    });
  }

  refreshDatagrid() {
    this.trackClick(SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.REFRESH);
    this.trackPage({
      ...SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.DATAGRID,
      name: SOFTPHONE_TRACKING.DEVICE_MANAGEMENT.DATAGRID.name.replace(
        /{{deviceAction}}/g,
        'refresh',
      ),
    });
    this.fetchSoftPhoneInformations();
  }
}
