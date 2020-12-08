import get from 'lodash/get';
import includes from 'lodash/includes';

export default class DedicatedAccountContactsCtrl {
  /* @ngInject */
  constructor(
    $location,
    $q,
    $scope,
    $state,
    $timeout,
    AccountCreationURLS,
    Alerter,
    atInternet,
    OvhApiMe,
  ) {
    this.$location = $location;
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.AccountCreationURLS = AccountCreationURLS;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.OvhApiMe = OvhApiMe;
  }

  $onInit() {
    this.loaders = {
      init: false,
    };
    this.user = null;
    this.loaders.init = true;

    this.$scope.resetAction = () => {
      this.$scope.setAction(false);
    };

    this.$scope.setAction = (action, data, basePath) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;
      if (action) {
        if (basePath) {
          this.$scope.stepPath = `${basePath}${this.$scope.currentAction}.html`;
        }
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    };

    return this.OvhApiMe.v6()
      .get()
      .$promise.then((user) => {
        this.user = user;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('user_account_contacts_error'),
          err,
          'useraccount.alerts.dashboardContacts',
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  getAccountCreationUrl() {
    const subs = get(this.user, 'ovhSubsidiary', 'default');
    const languageSpecificSubs = '{$language}_{$subs}';
    const newNicUrl =
      this.AccountCreationURLS[languageSpecificSubs] ||
      this.AccountCreationURLS[subs];
    return newNicUrl;
  }

  trackAccountCreation() {
    const chapter2 = includes(this.$state.current.name, 'services')
      ? 'services'
      : 'requests';
    this.atInternet.trackClick({
      name: 'create_new_account',
      type: 'action',
      chapter1: 'contacts',
      chapter2,
    });
  }
}
