import head from 'lodash/head';

import {
  CPANEL_PREMIER_TYPES,
  CPANEL_ADMIN_TYPE,
  CPANEL_PRO_TYPE,
  MAX_CPANEL_PRO_ACCOUNTS,
  MAX_CPANEL_ADMIN_ACCOUNTS,
  CPANEL_SOLO_TYPE,
  MAX_CPANEL_SOLO_ACCOUNTS,
  CPANEL_PLUS_TYPE,
  MAX_CPANEL_PLUS_ACCOUNTS,
  LICENCE_TYPES,
} from '../license-order.constants';

export default class LicenseOrderLegacyController {
  /* @ngInject */
  constructor(
    $translate,
    Alerter,
    License,
    licenseFeatureAvailability,
    LicenseOrder,
  ) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.License = License;
    this.licenseFeatureAvailability = licenseFeatureAvailability;
    this.LicenseOrder = LicenseOrder;
    this.loaders = {
      orderableVersion: true,
      durations: false,
      prices: false,
      bc: false,
    };
    this.nbLicense = 0;
  }

  $onInit() {
    this.types = {};
    this.availableTypes = this.License.types;
    this.durations = LicenseOrderLegacyController.getResetedDurations();
    this.contractsValidated = false;
    this.agoraUrl = '';
    this.order = null;
    this.agoraEnabled = this.licenseFeatureAvailability.allowLicenseAgoraOrder();
  }

  $onChanges({ ip }) {
    this.resetSelection();
    if (ip) {
      this.getOrderableVersion();
    }
  }

  loadPrices(licenseInfo, durations) {
    this.loaders.prices = true;

    this.LicenseOrder.getLicensePrices(licenseInfo, durations)
      .then((prices) => {
        if (durations?.length === 1) {
          [this.duration] = durations;
          this.getAgoraUrl();
        }

        this.durations.details = prices;
      })
      .finally(() => {
        this.loaders.prices = false;
      });
  }

  getExistingServiceName(licenseType) {
    return this.types[licenseType].existingServiceName;
  }

  getOrderableVersion() {
    this.loaders.orderableVersion = true;

    if (this.ip) {
      this.License.orderableVersion(this.ip)
        .then((data) => {
          this.types = data;
          this.loaders.orderableVersion = false;
          this.nbLicense = 0;
          Object.values(this.types).forEach((value) => {
            this.nbLicense += value.options.length;
          });
        })
        .then(() => {
          this.getDuration();
        });
    } else {
      this.loaders.orderableVersion = false;
      this.selectedType = null;
      this.nbLicense = Object.values(this.types || {}).length || 0;
    }
  }

  isDomainNumberMandatory() {
    return this.ip && this.version?.options?.length > 0;
  }

  getResetedOptions() {
    return {
      PLESK: {
        domainNumber: {
          mandatory: this.isDomainNumberMandatory(),
          value: null,
        },
        antivirus: null,
        languagePackNumber: null,
        powerpack: null,
      },
      WINDOWS: {
        sqlVersion: null,
      },
    };
  }

  static getResetedDurations() {
    return {
      available: null,
      details: {},
    };
  }

  hasMoreOptions() {
    return this.options?.[this.licenseType] !== null;
  }

  isSelectionValid() {
    let valid = this.licenseType && this.version && this.ip;
    if (this.licenseType && this.options[this.licenseType]) {
      const moreOptions = Object.values(this.options[this.licenseType]);
      moreOptions.forEach((option) => {
        valid =
          valid &&
          (!option?.mandatory ||
            (option.value !== null &&
              (option.shouldBeEqualsTo === undefined ||
                option.shouldBeEqualsTo === option.value)));
      });
    }

    return valid;
  }

  selectType(type) {
    if (
      type &&
      type !== this.licenseType &&
      this.isAvailable(type) &&
      !this.loaders.prices
    ) {
      // In case of license upgrade, show an information popup and redirect to upgrade screen.
      const existingServiceName = this.getExistingServiceName(type);
      if (existingServiceName) {
        this.setAction({
          action: 'redirection/upgrade/license-redirection-upgrade',
          data: {
            licenseId: existingServiceName,
            licenseType: type,
          },
        });
        return;
      }

      this.licenseType = type;
      this.version = null;
      if (
        this.types[this.licenseType].options?.length > 0 &&
        this.types[this.licenseType].options[0].options?.length === 1
      ) {
        // eslint-disable-next-line prefer-destructuring
        this.version = this.types[this.licenseType].options[0].options[0];
      }
      const { options } = this.types[this.licenseType].options[0] || [];
      if (this.licenseType === LICENCE_TYPES.CPANEL) {
        this.formatedOptions = options.map((option) => {
          const formattedOption = {
            ...option,
          };
          const value = formattedOption.value || '';
          switch (true) {
            case value.includes(CPANEL_SOLO_TYPE):
              formattedOption.cPanelCount = MAX_CPANEL_SOLO_ACCOUNTS;
              formattedOption.displayName = this.$translate.instant(
                'license_designation_CPANEL_solo_option',
              );
              break;
            case CPANEL_PREMIER_TYPES.filter((cPanelType) =>
              value.includes(cPanelType),
            ).length > 0:
              formattedOption.cPanelCount = parseInt(
                head(value.match(/[\d]+/)),
                10,
              );
              formattedOption.displayName = this.$translate.instant(
                'license_designation_CPANEL_premier_option',
                { numberOfCPANEL: formattedOption.cPanelCount },
              );
              break;
            case value.includes(CPANEL_PLUS_TYPE):
              formattedOption.cPanelCount = MAX_CPANEL_PLUS_ACCOUNTS;
              formattedOption.displayName = this.$translate.instant(
                'license_designation_CPANEL_plus_option',
              );
              break;
            case value.includes(CPANEL_ADMIN_TYPE):
              formattedOption.cPanelCount = MAX_CPANEL_ADMIN_ACCOUNTS;
              formattedOption.displayName = this.$translate.instant(
                'license_designation_CPANEL_admin_option',
              );
              break;
            case value.includes(CPANEL_PRO_TYPE):
              formattedOption.cPanelCount = MAX_CPANEL_PRO_ACCOUNTS;
              formattedOption.displayName = this.$translate.instant(
                'license_designation_CPANEL_pro_option',
              );
              break;
            default:
              break;
          }
          return formattedOption;
        });
        this.formatedOptions = this.formatedOptions.sort(
          (optionA, optionB) => optionA.cPanelCount - optionB.cPanelCount,
        );
      } else {
        this.formatedOptions = options.map((option) => ({
          ...option,
          displayName: this.$translate.instant(
            `license_designation_${this.licenseType}_version_${option.value}`,
          ),
        }));
      }

      this.options = this.getResetedOptions();
      this.onOptionsChange(true);
      this.agoraUrl = '';
    }
  }

  isAvailable(type) {
    if (this.types) {
      return (
        this.types[type]?.options?.length > 0 &&
        (!this.licenseFeatureAvailability.allowLicenseAgoraOrder() ||
          this.licenseFeatureAvailability.allowLicenseTypeAgoraOrder(type))
      );
    }

    return false;
  }

  getWhatToSendFromSelected() {
    if (!this.version || !this.licenseType) {
      return null;
    }

    return {
      licenseType: this.licenseType,
      ip: this.ip,
      version: this.version.value,
      options: this.options[this.licenseType],
    };
  }

  getDuration() {
    if (!this.loaders.durations && this.isSelectionValid()) {
      this.loaders.durations = true;
      const asking = this.getWhatToSendFromSelected();

      return this.LicenseOrder.getLicenseDurations(asking).then(
        (durations) => {
          if (angular.equals(asking, this.getWhatToSendFromSelected())) {
            this.durations.available = durations;
            this.loadPrices(asking, durations);
          }

          this.loaders.durations = false;
        },
        (data) => {
          this.loaders.durations = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant('license_order_loading_error'),
            data.data,
            'license.alerts.order',
          );
        },
      );
    }
    return null;
  }

  selectDuration() {
    this.loaders.bc = false;
    this.order = null;
    if (this.agoraEnabled && this.duration) {
      this.getAgoraUrl();
    }
    this.contractsValidated = false;
  }

  generateBc() {
    this.loaders.bc = true;
    this.License.orderLicenseOrderForDuration({
      licenseType: this.licenseType,
      ip: this.ip,
      version: this.version.value,
      options: this.options[this.licenseType],
      duration: this.duration,
    }).then((details) => {
      this.order = details;
      this.loaders.bc = false;
    });
  }

  getAgoraUrl() {
    const licenseInfo = {
      duration: this.duration,
      ...this.getWhatToSendFromSelected(),
    };
    this.agoraUrl = '';

    this.loaders.agoraUrl = true;
    return this.LicenseOrder.getFinalizeOrderUrl(licenseInfo)
      .then((url) => {
        this.agoraUrl = url;
      })
      .finally(() => {
        this.loaders.agoraUrl = false;
      });
  }

  openBc() {
    window.open(this.order.url);
  }

  resetSelection() {
    this.licenseType = null;
    this.onOptionsChange(true);
  }

  onOptionsChange(ignoreGetDuration = false) {
    this.duration = null;
    this.loaders.bc = false;
    this.order = null;
    this.durations = LicenseOrderLegacyController.getResetedDurations();
    if (!ignoreGetDuration) {
      this.getDuration();
    }
  }

  onSelectedVersionChange() {
    this.options = this.getResetedOptions();
    this.onOptionsChange();
  }
}
