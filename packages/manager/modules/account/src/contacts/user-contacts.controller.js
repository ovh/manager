import get from 'lodash/get';
import includes from 'lodash/includes';
import config from '../config/config';

export default class AccountUserContactsController {
  /* @ngInject */
  constructor(
    $location,
    $q,
    $scope,
    $state,
    $timeout,
    Alerter,
    atInternet,
    coreConfig,
  ) {
    this.$location = $location;
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
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

    this.user = this.coreConfig.getUser();
    this.loaders.init = false;
  }

  getAccountCreationUrl() {
    const subs = get(this.user, 'ovhSubsidiary', 'default');
    const languageSpecificSubs = '{$language}_{$subs}';
    const newNicUrl =
      config.constants.accountCreation[languageSpecificSubs] ||
      config.constants.accountCreation[subs];
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
