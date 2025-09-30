import forEach from 'lodash/forEach';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';
import slice from 'lodash/slice';

import { TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS } from '../../line/phone/phone.constant';
import {
  LOGO_FILE_FORMATS,
  MAX_SIZE_LOGO_FILE,
} from '../../line/softphone/softphone.constants';
import { BILLING_ACCOUNT_TRACKING } from '../billingAccount.constants';

export default /* @ngInject */ function TelecomTelephonyBillingAccountDashboardCtrl(
  $translate,
  $scope,
  $stateParams,
  $state,
  $q,
  $window,
  $timeout,
  atInternet,
  billingDepositLink,
  TelephonyMediator,
  OvhApiTelephony,
  softphoneService,
  TucToast,
  TucToastError,
  TelephonyGroupLinePhone,
  billingAccountId,
  isSvaWalletFeatureAvailable,
  svaWallet,
  themes,
  isSvaWalletValid,
  svaWalletOnboarding,
) {
  const self = this;

  self.LOGO_FILE_FORMATS = LOGO_FILE_FORMATS;
  self.MAX_SIZE_LOGO_FILE = MAX_SIZE_LOGO_FILE;
  self.themes = themes;

  self.svaWallet = svaWallet;
  self.isSvaWalletValid = isSvaWalletValid;
  self.svaWalletOnboarding = svaWalletOnboarding;

  self.isSvaWalletFeatureAvailable = isSvaWalletFeatureAvailable;
  self.showSvaProfile = false;

  self.billingAccountId = billingAccountId;

  function isExpired() {
    return self.group ? self.group.status === 'expired' : false;
  }

  function isClosed() {
    return self.group ? self.group.status === 'closed' : false;
  }

  function shouldIncreaseDeposit() {
    return self.group ? self.group.shouldIncreaseDeposit() : false;
  }

  function getGroup() {
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;
        self.phoneDetails.raw = self.group.lines;
        return self.group;
      })
      .catch((err) => {
        if (err.status === 404) {
          return $state.go('telecom.welcoming');
        }
        return new TucToastError(err);
      });
  }

  function getPhonePicture(phone) {
    if (phone) {
      return TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS[phone.brand]
        ? TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS[phone.brand].icon
        : 'ovh-font-phoneAlt';
    }
    return 'ovh-font-lineCommunicating';
  }

  function fetchPhones(line) {
    self.loading.phones = true;

    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .get({
        billingAccount: line.billingAccount,
        serviceName: line.serviceName,
      })
      .$promise.then(
        (phoneOpts) => {
          set(
            line,
            'phone',
            new TelephonyGroupLinePhone(
              {
                billingAccount: line.billingAccount,
                serviceName: line.serviceName,
              },
              phoneOpts,
            ),
          );

          set(line, 'hasPhone', true);

          return line.phone.getRMAs().then(
            (RMAs) => {
              set(line, 'phone.RMAs', RMAs);
              return line;
            },
            () => {
              set(line, 'phone.RMAs', []);
              return line;
            },
          );
        },
        () => {
          set(line, 'hasPhone', false);
          set(line, 'RMAs', []);
          return line;
        },
      );
  }

  function fetchPhonesDone(lines) {
    self.loading.phones = false;
    return lines;
  }

  function getPortability() {
    self.loading.portability = true;
    self.portabilities = 0;

    if (isExpired()) {
      self.loading.portability = false;
      return self.portability;
    }

    return OvhApiTelephony.Portability()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((ids) => {
        self.portabilities = ids.length;
        return self.portabilities;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading.portability = false;
      });
  }

  function getBill() {
    self.loading.bills = true;
    self.bills = [];

    if (isExpired()) {
      self.loading.bills = false;
      return self.bills;
    }

    return OvhApiTelephony.HistoryConsumption()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              slice(ids, ids.length - 5),
              (chunkIds) =>
                OvhApiTelephony.HistoryConsumption()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    date: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => {
            const result = map(flatten(chunkResult), 'value');
            self.bills = forEach(result, (consumption) => {
              set(
                consumption,
                'priceValue',
                consumption.price ? consumption.price.value : null,
              );
            });
            return self.bills;
          })
          .catch((err) => new TucToastError(err))
          .finally(() => {
            self.loading.bills = false;
          }),
      );
  }

  function getConsumption() {
    self.loading.consumption = true;

    self.consumption = [
      {
        label: 'outgoing',
        count: 0,
      },
      {
        label: 'incoming',
        count: 0,
      },
      {
        label: 'transfer',
        count: 0,
      },
    ];

    if (isExpired()) {
      self.loading.consumption = false;
      return self.consumption;
    }

    return OvhApiTelephony.Service()
      .VoiceConsumption()
      .Aapi()
      .get({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((consumption) => {
        if (self.group.lines && self.group.lines.length) {
          self.consumption = [];

          forEach(consumption.summary, (count, type) => {
            if (type !== 'total') {
              self.consumption.push({
                label: type,
                count,
                color: '',
              });
            }
          });
        }

        return self.consumption;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading.consumption = false;
        return self.consumption;
      });
  }

  function getFile(consumption, type) {
    const tryDownload = function tryDownload() {
      return OvhApiTelephony.HistoryConsumption()
        .v6()
        .getFile({
          billingAccount: $stateParams.billingAccount,
          date: consumption.date,
          extension: type,
        })
        .$promise.then((info) => {
          if (info.status === 'error') {
            return $q.reject({
              statusText: 'Unable to download message',
            });
          }
          if (info.status === 'done') {
            return $q.when(info);
          }

          // file is not ready to download, just retry
          return $timeout(tryDownload, 1000);
        });
    };
    return tryDownload();
  }

  function download(consumption, type) {
    set(consumption, 'downloading', true);
    getFile(consumption, type)
      .then((info) => {
        // eslint-disable-next-line no-param-reassign
        $window.location.href = info.url;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        set(consumption, 'downloading', false);
      });
  }

  this.isGroupSuspended = function isGroupSuspended() {
    return (isExpired() || isClosed()) && shouldIncreaseDeposit();
  };

  this.updateFilesList = function updateFilesList() {
    if (this.fileModel?.length > 1) {
      this.fileModel.shift();
    }
  };

  this.applyThemeGlobally = function applyThemeGlobally() {
    this.trackClick(BILLING_ACCOUNT_TRACKING.THEME_MANAGEMENT.APPLY);
    this.isUpdatingTheme = true;
    softphoneService
      .putSoftphoneThemeGlobally($stateParams.billingAccount, this.currentTheme)
      .then(() =>
        TucToast.success(
          $translate.instant(
            'telephony_group_line_softphone_apply_theme_success',
          ),
        ),
      )
      .catch((error) =>
        TucToast.error(
          $translate.instant(
            'telephony_group_line_softphone_apply_theme_error',
            {
              errorMessage: error.message,
            },
          ),
        ),
      )
      .finally(() => {
        this.loadSoftphone();
        this.isUpdatingTheme = false;
      });
  };

  this.applyLogoGlobally = function applyLogoGlobally() {
    this.isUpdatingLogo = true;
    softphoneService.uploadDocument(this.fileModel[0]).then((url) => {
      softphoneService
        .putSoftphoneLogoGlobally(
          $stateParams.billingAccount,
          this.fileModel[0].infos.name,
          url,
        )
        .then(() => {
          TucToast.success(
            $translate.instant(
              'telephony_group_line_softphone_apply_logo_add_success',
            ),
          );
          this.trackBanner('info', 'success');
        })
        .catch(({ data }) => {
          TucToast.error(
            $translate.instant(
              'telephony_group_line_softphone_apply_logo_add_error',
              {
                errorMessage: data?.message,
              },
            ),
          );
          this.trackBanner('error', 'error');
        })
        .finally(() => {
          this.fileModel = undefined;
          this.isUpdatingLogo = false;
          this.loadSoftphone();
        });
    });
  };

  this.deleteGlobalLogo = function deleteGlobalLogo() {
    this.trackClick(BILLING_ACCOUNT_TRACKING.LOGO_MANAGEMENT.DELETE);
    softphoneService
      .deleteSoftphoneLogoGlobally($stateParams.billingAccount)
      .then(() =>
        TucToast.success(
          $translate.instant(
            'telephony_group_line_softphone_apply_logo_remove_success',
          ),
        ),
      )
      .catch(({ data }) =>
        TucToast.error(
          $translate.instant(
            'telephony_group_line_softphone_apply_logo_remove_error',
            {
              errorMessage: data?.message,
            },
          ),
        ),
      )
      .finally(() => {
        this.loadSoftphone();
      });
  };

  this.helpTextForLogo = function helpTextForLogo() {
    return $translate.instant('telephony_group_line_softphone_logo_format', {
      format: LOGO_FILE_FORMATS,
      weight: `${MAX_SIZE_LOGO_FILE / 1000000} ${$translate.instant(
        'ua_unit_size_MB',
      )}`,
      size: '512x512',
    });
  };

  this.loadSoftphone = function loadSoftphone() {
    this.isSoftphoneLoading = true;
    $q.all({
      logo: softphoneService.getGlobalLogo(this.billingAccountId),
      currentTheme: softphoneService.getSoftphoneCurrentGlobalTheme(
        this.billingAccountId,
      ),
    })
      .then(({ logo: { url, filename }, currentTheme: { themeId } }) => {
        this.logoUrl = url;
        this.logoFilename = filename;

        this.currentTheme = themeId;
        this.selectedTheme = this.currentTheme;
      })
      .finally(() => {
        this.isSoftphoneLoading = false;
      });
  };

  this.trackBanner = function trackBanner(bannerType, returnType) {
    atInternet.trackPage({
      ...BILLING_ACCOUNT_TRACKING.LOGO_MANAGEMENT.BANNER,
      name: BILLING_ACCOUNT_TRACKING.LOGO_MANAGEMENT.BANNER.name
        .replace(/{{bannerType}}/g, bannerType)
        .replace(/{{returnType}}/g, returnType),
      page: {
        name: BILLING_ACCOUNT_TRACKING.LOGO_MANAGEMENT.BANNER.page.name
          .replace(/{{bannerType}}/g, bannerType)
          .replace(/{{returnType}}/g, returnType),
      },
    });
  };

  this.trackClick = function trackClick(hit) {
    atInternet.trackClick({
      ...hit,
      type: 'action',
    });
  };

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  this.$onInit = function $onInit() {
    self.loading = {};
    self.groupHasAtLeastOnePhone = false;

    self.download = download;
    self.getPhonePicture = getPhonePicture;
    self.fetchPhones = fetchPhones;
    self.fetchPhonesDone = fetchPhonesDone;
    $scope.itemsPerPage = 5;

    /** TODO implement filter */
    self.phoneDetails = {
      raw: null,
      paginated: null /* ,
            sorted: null,
            orderBy: "",
            orderDesc: true */,
    };

    self.billingDepositLink = billingDepositLink;
    this.loadSoftphone();
    getGroup().then(() => {
      self.actions = [
        {
          name: 'telephony_group_admin_actions_order',
          sref: 'telecom.telephony.billingAccount.orderAlias',
          disabled: isExpired(),
          text: $translate.instant(
            'telephony_group_billing_dashboard_actions_group_order',
          ),
        },
        {
          name: 'telephony_group_admin_actions_bill',
          sref: 'telecom.telephony.billingAccount.billing.bill',
          text: $translate.instant(
            'telephony_group_billing_dashboard_go_to_my_bills',
          ),
        },
        {
          name: 'telephony_group_admin_actions_delete',
          sref: 'telecom.telephony.billingAccount.administration.deleteGroup',
          disabled: isExpired(),
          text: $translate.instant(
            'telephony_group_billing_dashboard_actions_group_delete',
          ),
        },
      ];

      return $q
        .all([getPortability(), getBill(), getConsumption()])
        .then(() => {
          if (isSvaWalletFeatureAvailable && this.svaWallet) {
            this.showSvaProfile = true;
          }
        });
    });
  };

  /* -----  End of INITIALIZATION  ------*/

  this.$onInit();
}
