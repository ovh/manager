import isObject from 'lodash/isObject';
import map from 'lodash/map';
import set from 'lodash/set';

import config from '../../../../../config/config';
import { DEDICATED_CLOUD_CONSTANTS } from '../../../dedicatedCloud.constant';

export default class {
  /* @ngInject */
  constructor($q, $scope, $translate, DedicatedCloud, Poller, User) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.Poller = Poller;
    this.User = User;
  }

  $onInit() {
    this.loading = true;
    this.requiredOptionNames = ['nsx', 'vrops'];
    this.optionNames = DEDICATED_CLOUD_CONSTANTS.securityOptions;
    this.options = {};
    this.pccCompliancies = {
      nsx: false,
      vrops: false,
    };

    this.$scope.$on('option-enable', (event, params) => {
      this.options[params.optionName].state = 'enabling';
      this.pollTask(params.taskId).then(() => {
        this.options[params.optionName].state = 'enabled';
      });
    });

    this.getGuide();
    return this.$q
      .all([this.loadOptionsStates(), this.loadVropsAndNsxCompatibility()])
      .catch((err) => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_dashboard_loading_error',
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  allDisabled() {
    return !map(this.options).some((item) => item.state === 'enabled');
  }

  anyEnabling() {
    return map(this.options).some((item) => item.state === 'enabling');
  }

  nsxAndVropsCompliantPcc() {
    return !map(this.pccCompliancies).some((compliant) => !compliant);
  }

  getGuide() {
    return this.User.getUser().then((user) => {
      this.guides = {};
      this.optionNames.forEach((optionName) => {
        set(
          this.guides,
          optionName,
          config.constants.URLS[user.ovhSubsidiary].guides[optionName] ||
            config.constants.URLS[user.ovhSubsidiary].presentations.home ||
            config.constants.URLS.FR.presentations.home,
        );
      });
    });
  }

  checkOptionCompliance(optionName) {
    return this.DedicatedCloud.getOptionState(optionName, this.productId)
      .then((state) => {
        if (state !== 'disabled') {
          return true;
        }
        return this.DedicatedCloud.isOptionToggable(
          this.productId,
          optionName,
          'disabled',
          true,
        );
      })
      .then((response) => {
        if (isObject(response)) {
          return response.toggable;
        }
        return response;
      });
  }

  // If NSX or vROps can't be enabled for this PCC,
  // then none of these options can be enabled.
  loadVropsAndNsxCompatibility() {
    return this.$q
      .all({
        nsx: this.checkOptionCompliance('nsx'),
        vrops: this.checkOptionCompliance('vrops'),
      })
      .then((compliancies) => {
        angular.extend(this.pccCompliancies, compliancies);
      });
  }

  loadOptionsStates() {
    return this.$q.all(
      this.optionNames.map((optionName) =>
        this.DedicatedCloud.getOptionState(optionName, this.productId).then(
          (state) => {
            this.options[optionName] = {
              state,
            };
            return state;
          },
        ),
      ),
    );
  }

  pollTask(taskId) {
    return this.DedicatedCloud.getSelected(this.productId).then((pcc) =>
      this.Poller.poll(
        `apiv6/dedicatedCloud/${pcc.name}/task/${taskId}`,
        null,
        {
          successRule(task) {
            return task.state === 'done';
          },
          errorRule(task) {
            return (
              ['doing', 'todo', 'done', 'waitingForChilds'].indexOf(
                task.state,
              ) === -1
            );
          },
          namespace: 'dedicatedCloud.options.disable',
        },
      ),
    );
  }
}
