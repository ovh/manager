import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import set from 'lodash/set';

export default class SharepointAccountsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $location,
    $stateParams,
    $timeout,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
    MicrosoftSharepointOrderService,
    Poller,
  ) {
    this.$scope = $scope;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
    this.sharepointOrder = MicrosoftSharepointOrderService;
    this.pollerService = Poller;
  }

  $onInit() {
    this.timeout = null;
    this.search = {};
    this.accounts = [];
    this.exchangeId = this.$stateParams.exchangeId;
    this.hasResult = false;
    this.usesAgora = null;
    this.loaders = {
      init: true,
      search: false,
      usesAgora: true,
    };

    this.sharepointService
      .getAssociatedExchangeService(this.exchangeId)
      .catch(() => {
        this.isStandAlone = true;
      });

    this.getSharepoint()
      .then(() =>
        this.sharepointOrder.fetchingDoesServiceUseAgora(this.exchangeId),
      )
      .then(({ billingMigrated }) => {
        this.usesAgora = billingMigrated;
      })
      .finally(() => {
        this.loaders.usesAgora = false;
      });

    this.getAccountIds();

    this.$scope.$on('$destroy', () => {
      this.pollerService.kill({
        namespace: 'sharepoint.accounts.poll',
      });
    });
  }

  static setAccountProperties(account, userPrincipalName) {
    set(account, 'userPrincipalName', userPrincipalName);
    set(account, 'activated', true);
    set(
      account,
      'usedQuota',
      filesize(account.currentUsage, { standard: 'iec', output: 'object' }),
    );
    set(
      account,
      'totalQuota',
      filesize(account.quota, { standard: 'iec', output: 'object' }),
    );
    set(
      account,
      'percentUse',
      Math.round((account.currentUsage / account.quota) * 100),
    );
  }

  updateSearch() {
    return this.getAccountIds();
  }

  emptySearch() {
    this.search.value = '';
    this.updateSearch();
  }

  getSharepoint() {
    return this.sharepointService
      .getSharepoint(this.$stateParams.exchangeId)
      .then((sharepoint) => {
        this.sharepoint = sharepoint;
        if (isNull(this.sharepoint.url)) {
          this.$location.path(
            `/sharepoint/${this.$stateParams.exchangeId}/${this.sharepoint.domain}/setUrl`,
          );
        }
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_dashboard_error'),
          err,
          this.$scope.alerts.main,
        );
      });
  }

  updateSharepoint(account, type, officeLicense) {
    return this.sharepointService
      .updateSharepointAccount(this.exchangeId, account.userPrincipalName, {
        accessRights: type,
        officeLicense,
      })
      .then(() => {
        this.alerter.success(
          this.$translate.instant('sharepoint_accounts_action_success', {
            t0: account.userPrincipalName,
          }),
          this.$scope.alerts.main,
        );
        return this.sharepointService.getAccountSharepoint(
          this.exchangeId,
          account.userPrincipalName,
        );
      })
      .then((sharepoint) => {
        if (sharepoint.taskPendingId > 0) {
          set(account, 'taskPendingId', sharepoint.taskPendingId);
          this.startPoller(account.userPrincipalName);
        } else {
          const index = findIndex(this.accounts, {
            userPrincipalName: account.userPrincipalName,
          });
          if (index > -1) {
            this.constructor.setAccountProperties(
              sharepoint,
              account.userPrincipalName,
            );
            this.accounts[index] = sharepoint;
          }
        }
      })
      .catch(() => {
        this.alerter.error(
          this.$translate.instant('sharepoint_accounts_action_error', {
            t0: account.userPrincipalName,
          }),
          this.$scope.alerts.main,
        );
      });
  }

  startPoller(userPrincipalName) {
    return this.pollerService
      .poll(
        `apiv6/msServices/${this.exchangeId}/account/${userPrincipalName}/sharepoint`,
        null,
        {
          interval: 15000,
          successRule: { state: (account) => account.taskPendingId === 0 },
          namespace: 'sharepoint.accounts.poll',
        },
      )
      .then((account) => {
        const index = findIndex(this.accounts, { userPrincipalName });
        if (index > -1) {
          this.constructor.setAccountProperties(account, userPrincipalName);
          this.accounts[index] = account;
        }
      })
      .catch(() => {
        this.pollerService.kill({
          namespace: 'sharepoint.accounts.poll',
        });
      });
  }

  activateSharepointUser(account) {
    if (!account.taskPendingId) {
      if (account.accessRights === 'administrator') {
        this.updateSharepoint(account, 'user');
      }
    }
  }

  activateSharepointAdmin(account) {
    if (!account.taskPendingId) {
      if (account.accessRights === 'user') {
        this.updateSharepoint(account, 'administrator');
      }
    }
  }

  activateSharepoint(account) {
    if (!account.taskPendingId) {
      window.open(
        this.sharepointService.getSharepointAccountOrderUrl(
          this.$stateParams.productId,
          account.userPrincipalName,
        ),
        '_blank',
      );
    }
  }

  activateOfficeLicence(account) {
    if (!account.taskPendingId) {
      this.updateSharepoint(account, null, true);
    }
  }

  deactivateOfficeLicence(account) {
    if (!account.taskPendingId) {
      this.updateSharepoint(account, null, false);
    }
  }

  deactivateSharepoint(account) {
    if (!account.taskPendingId) {
      this.$scope.setAction(
        'account/delete/sharepoint-account-delete',
        account,
      );
    }
  }

  activateOffice(account) {
    if (!account.taskPendingId) {
      this.$scope.setAction('activate/sharepoint-activate', account);
    }
  }

  updatePassword(account) {
    if (!account.taskPendingId) {
      this.$scope.setAction(
        'account/password/update/sharepoint-account-password-update',
        account,
      );
    }
  }

  updateAccount(account) {
    if (!account.taskPendingId && this.isStandAlone) {
      this.$scope.setAction(
        'account/update/sharepoint-account-update',
        account,
      );
    }
  }

  resetAdminRights() {
    this.$scope.setAction('admin-rights/reset/sharepoint-admin-rights-reset');
  }

  getAccountIds() {
    this.loaders.search = true;
    this.accountIds = null;

    return this.sharepointService
      .getAccounts(this.exchangeId, this.search.value)
      .then((ids) => {
        this.accountIds = ids.map((accountId) => ({ accountId }));
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_accounts_err'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        if (isEmpty(this.accountIds)) {
          this.loaders.search = false;
        } else {
          this.hasResult = true;
        }
        this.loaders.init = false;
      });
  }

  onTranformItem(userPrincipalName) {
    return this.sharepointService
      .getAccountSharepoint(this.exchangeId, userPrincipalName)
      .then((sharepoint) => {
        this.constructor.setAccountProperties(sharepoint, userPrincipalName);
        if (sharepoint.taskPendingId > 0) {
          this.startPoller(userPrincipalName);
        }
        return sharepoint;
      })
      .catch(() => ({
        userPrincipalName,
        activated: false,
      }));
  }
}
