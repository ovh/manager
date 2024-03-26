import flatten from 'lodash/flatten';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import set from 'lodash/set';
import uniq from 'lodash/uniq';

import { RECOMMENDED_VERSION } from './config.constants';

angular.module('App').controller(
  'HostingEditOvhConfig',
  class HostingEditOvhConfig {
    constructor(
      $scope,
      $q,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingOvhConfig,
      WucUser,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.hostingService = Hosting;
      this.hostingOvhConfigService = HostingOvhConfig;
      this.WucUser = WucUser;
    }

    $onInit() {
      this.capabilities = [];
      this.errorMsg = null;
      this.loading = false;
      this.model = {};
      this.toggle = {
        areInitializationErrors: false,
        areOldConfigsExist: false,
        isConfigCanBeSaved: false,
        isConfigIsEdited: false,
        isErrorNotDefined: false,
        isPhpVersionAvailable: false,
        isRollbackProcess: false,
        process: null,
      };
      this.selectedConfig = null;

      this.$scope.setProcess = () => this.setProcess();
      this.$scope.saveConfig = () => this.saveConfig();

      this.initWizard();

      this.recommendedVersion = RECOMMENDED_VERSION;
    }

    static parseLabel(label) {
      if (isString(label) && !isEmpty(label)) {
        return label.replace('.', '_');
      }
      return 'null';
    }

    initWizard() {
      const queue = [];
      this.loading = true;

      this.WucUser.getUrlOf('guides').then((guides) => {
        this.phpAppendicesGuide = guides.phpAppendices;
        this.hostingPhpGuide = guides.hostingPhpConfiguration;
      });

      queue.push(
        this.hostingService.getModels().then((apiStruct) => {
          this.apiStruct = {
            models: apiStruct.models,
          };
        }),
      );

      queue.push(
        this.hostingOvhConfigService
          .getHistoric(this.$stateParams.productId)
          .then((configs) => {
            this.oldConfigs = configs;
          }),
      );

      queue.push(
        this.hostingOvhConfigService
          .getCurrent(this.$stateParams.productId)
          .then((conf) => {
            this.currentConfig = conf;
          }),
      );

      queue.push(
        this.hostingOvhConfigService
          .getCapabilities(this.$stateParams.productId)
          .then((capabilities) => {
            this.capabilities = capabilities;
            this.phpVersion = this.capabilities.map(({ version }) => version);
            this.envExecutions = uniq(
              flatten(
                this.capabilities.map(({ containerImage }) => containerImage),
              ),
            );
          }),
      );

      return this.$q
        .all(queue)
        .catch(() => {
          this.toggle.areInitializationErrors = true;
        })
        .finally(() => {
          this.loading = false;
          if (isArray(this.oldConfigs) && !isEmpty(this.oldConfigs)) {
            this.toggle.areOldConfigsExist = true;
          } else {
            this.toggle.areOldConfigsExist = false;
            this.toggle.isRollbackProcess = false;
            this.toggle.process = 'update';
          }
        });
    }

    updateEnvExecutionsAvailable() {
      this.envExecutions = this.capabilities.find(({ version }) =>
        version.includes(this.model.engineVersion),
      ).containerImage;
      if (this.envExecutions.length === 1) {
        this.model = { ...this.model, container: this.envExecutions[0] };
      }
    }

    setProcess() {
      if (this.toggle.process === 'rollback') {
        this.toggle.isRollbackProcess = true;
        [this.selectedConfig] = this.oldConfigs;
      } else {
        this.selectedConfig = this.currentConfig;
      }

      this.changeToConfig(this.selectedConfig);
    }

    changeToConfig(ovhConfig) {
      this.clearDisplayedError();
      this.toggle.isConfigIsEdited = false;
      set(this.model, 'engineName', ovhConfig.engineName);
      set(this.model, 'engineVersion', ovhConfig.engineVersion);
      set(this.model, 'environment', ovhConfig.environment);
      set(this.model, 'httpFirewall', ovhConfig.httpFirewall);
      set(this.model, 'container', ovhConfig.container || 'stable');
      this.checkCohesion();
    }

    updateConfig() {
      this.changeToConfig(this.selectedConfig);
    }

    updateSelectedConfig() {
      this.clearDisplayedError();
      this.updateEnvExecutionsAvailable();
      this.toggle.isConfigIsEdited = true;
      this.checkCohesion();
    }

    checkCohesion() {
      if (this.toggle.isRollbackProcess) {
        this.toggle.isConfigCanBeSaved = true;
      } else if (
        this.apiStruct.models[
          'hosting.web.ovhConfig.AvailableEngineVersionEnum'
        ].enum.includes(this.model.engineVersion) &&
        this.capabilities
          .find(({ version }) => version.includes(this.model.engineVersion))
          .containerImage.includes(this.model.container)
      ) {
        this.toggle.isPhpVersionAvailable = true;
        this.toggle.isConfigCanBeSaved = this.toggle.isConfigIsEdited;
      } else {
        this.toggle.isPhpVersionAvailable = false;
        this.toggle.isConfigCanBeSaved = false;
      }
    }

    saveConfig() {
      if (this.toggle.isConfigIsEdited) {
        const model = angular.copy(this.model);
        model.id = this.currentConfig.id;
        return this.hostingOvhConfigService
          .changeConfiguration(this.$stateParams.productId, model)
          .then(() => {
            this.alerter.success(
              this.$translate.instant('hosting_action_config_edit_success'),
              this.$scope.alerts.main,
            );
            this.$scope.$emit(
              this.hostingOvhConfigService.events.ovhConfigNeedRefresh,
            );
            this.$scope.resetAction();
          })
          .catch((err) => {
            this.displayError(err);
          });
      }
      return this.hostingOvhConfigService
        .rollbackConfig(
          this.$stateParams.productId,
          this.currentConfig.id,
          this.selectedConfig.id,
        )
        .then(() => {
          this.alerter.success(
            this.$translate.instant('hosting_action_config_rollback_success'),
            this.$scope.alerts.main,
          );
          this.$scope.$emit(
            this.hostingOvhConfigService.events.ovhConfigNeedRefresh,
          );
          this.$scope.resetAction();
        })
        .catch((err) => {
          this.displayError(err);
        });
    }

    clearDisplayedError() {
      this.errorMsg = null;
      this.toggle.isErrorNotDefined = false;
    }

    displayError(err) {
      this.clearDisplayedError();
      this.checkCohesion();
      this.errorMsg = get(err, 'message');
      this.toggle.isErrorNotDefined = !this.errorMsg;
    }
  },
);
