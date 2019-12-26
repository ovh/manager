import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import delay from 'lodash/delay';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';

export default class SharepointUpdateRenewCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $location,
    $q,
    $stateParams,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$location = $location;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.search = {
      value: null,
    };
    this.loaders = {
      init: true,
    };
    this.buffer = {
      hasChanged: false,
      changes: [],
    };

    this.getAccountIds();

    this.$scope.submit = () => {
      this.$q
        .all(
          map(this.buffer.changes, (sharepoint) =>
            this.sharepointService.updateSharepointAccount(
              this.$stateParams.exchangeId,
              sharepoint.userPrincipalName,
              {
                deleteAtExpiration: sharepoint.deleteAtExpiration,
              },
            ),
          ),
        )
        .then(() => {
          this.alerter.success(
            this.$translate.instant(
              'sharepoint_exchange_update_billing_periode_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'sharepoint_exchange_update_billing_periode_failure',
            ),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.reset();
        });
    };

    this.$scope.reset = () => {
      this.$location.search('action', null);
      this.$scope.resetAction();
    };
  }

  goSearch() {
    return this.getAccountIds();
  }

  emptySearch() {
    this.search.value = '';
    return this.getAccountIds();
  }

  getAccountIds() {
    this.loaders.init = true;
    this.accountIds = null;
    this.bufferedAccounts = [];

    return this.sharepointService
      .getAccounts(this.$stateParams.exchangeId, this.search.value)
      .then((accountIds) => {
        this.accountIds = accountIds;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_accounts_err'),
          err,
          this.$scope.alerts.main,
        );
        this.$scope.resetAction();
      })
      .finally(() => {
        if (isEmpty(this.accountIds)) {
          this.loaders.init = false;
        }
      });
  }

  onTranformItem(userPrincipalName) {
    return this.sharepointService
      .getAccountSharepoint(this.$stateParams.exchangeId, userPrincipalName)
      .then((sharepoint) => {
        set(sharepoint, 'userPrincipalName', userPrincipalName);
        set(sharepoint, 'activated', true);
        this.bufferedAccounts.push(clone(sharepoint));
        return sharepoint;
      })
      .catch(() => ({
        userPrincipalName,
        activated: false,
      }));
  }

  onTranformItemDone() {
    this.loaders.init = false;
  }

  changeRenew(account, newValue) {
    const buffered = find(this.bufferedAccounts, {
      userPrincipalName: account.userPrincipalName,
    });

    if (buffered && buffered.deleteAtExpiration !== newValue) {
      this.buffer.changes.push(account);
    } else {
      remove(this.buffer.changes, account);
    }
    this.buffer.hasChanged = !!this.buffer.changes.length;
  }

  checkBuffer() {
    if (!this.accountIdsResume) {
      this.accountIdsResume = cloneDeep(this.accountIds);
    } else {
      this.accountIdsResume = [];
      delay(() => {
        this.accountIdsResume = cloneDeep(this.accountIds);
      }, 50);
    }
  }

  onTranformItemResume(userPrincipalName) {
    return this.sharepointService
      .getAccountSharepoint(this.$stateParams.exchangeId, userPrincipalName)
      .then((sharepoint) => {
        set(sharepoint, 'userPrincipalName', userPrincipalName);
        const buffered = find(this.buffer.changes, {
          userPrincipalName: sharepoint.userPrincipalName,
        });

        if (buffered) {
          set(sharepoint, 'deleteAtExpiration', buffered.deleteAtExpiration);
        }
        return sharepoint;
      })
      .catch(() => null);
  }
}
