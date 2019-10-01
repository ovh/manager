import find from 'lodash/find';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';

export default class VpsUpgradeLegacyCtrl {
  /* @ngInject */
  constructor($filter, $stateParams, $translate, $q, $window, CucCloudMessage, CucCloudNavigation,
    CucControllerHelper, VpsService) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.$q = $q;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.CucControllerHelper = CucControllerHelper;
    this.serviceName = $stateParams.serviceName;
    this.Vps = VpsService;

    this.loaders = {
      step1: false,
      step2: false,
    };

    this.completed = {
      step1: false,
      step2: false,
    };
    this.order = null;
    this.selectedModel = {};
    this.upgradesList = null;
  }

  gotoPreviousState() {
    return this.CucCloudNavigation.getPreviousState().go();
  }

  getCurrentModel() {
    return find(this.upgradesList, upgrade => upgrade.isCurrentModel === true);
  }

  validateStep1() {
    if (this.selectedModel.model === this.getCurrentModel().model) {
      const title = this.$translate.instant('vps_warning_title');
      const message = this.$translate.instant('vps_configuration_upgradevps_step1_warning');

      this.CucControllerHelper.modal.showWarningModal({ title, message });
      throw new Error(message);
    } else {
      this.completed.step1 = true;
    }
  }

  loadUpgradesList() {
    if (!this.upgradesList) {
      this.loaders.step1 = true;
      return this.Vps.upgradesList(this.serviceName).then((data) => {
        this.upgradesList = data.results;
        this.selectedModel.model = this.getCurrentModel().model;
        return data;
      }).catch((err) => {
        this.$q.reject(err);
        if (err.message) {
          this.CucCloudMessage.error(err.message);
        } else {
          this.CucCloudMessage.error(this.$translate.instant('vps_configuration_upgradevps_fail'));
        }
        this.gotoPreviousState();
      }).finally(() => {
        this.loaders.step1 = false;
      });
    }
    return this.$q.when();
  }

  initVpsConditions() {
    this.conditionsAgree = false;
    this.loaders.step2 = true;
    this.order = null;
    const modelToUpgradeTo = find(this.upgradesList, e => e.model === head(this.selectedModel.model.split(':')) && e.name === this.selectedModel.model.split(':')[1]);

    if (isEmpty(modelToUpgradeTo)) {
      return this.$q.when(true);
    }

    this.selectedModelForUpgrade = modelToUpgradeTo;

    return this.Vps
      .upgrade(
        this.serviceName,
        this.selectedModelForUpgrade.model,
        this.selectedModelForUpgrade.duration.duration,
      )
      .then((data) => {
        this.conditionsAgree = false;
        this.selectedModelForUpgrade.duration.dateFormatted = this.$filter('date')(this.selectedModelForUpgrade.duration.date, 'dd/MM/yyyy');
        this.order = data;
        return data;
      })
      .catch((err) => {
        this.$q.reject(err);
        if (err.message) {
          this.CucCloudMessage.error(err.message);
        } else {
          this.CucCloudMessage.error(this.$translate.instant('vps_configuration_upgradevps_fail'));
        }
      })
      .finally(() => {
        this.loaders.step2 = false;
      });
  }

  cancel() {
    this.gotoPreviousState();
  }

  confirm() {
    this.displayBC();
  }

  displayBC() {
    this.$window.open(
      this.order.url,
      '_blank',
    );
  }
}
