import clone from 'lodash/clone';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

angular.module('App').controller(
  'HostingEnvvarsCtrl',
  class HostingEnvvarsCtrl {
    constructor(
      $scope,
      $stateParams,
      $timeout,
      $translate,
      Alerter,
      Hosting,
      HostingEnvvars,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingEnvvars = HostingEnvvars;
    }

    $onInit() {
      this.loading = true;
      this.hasResult = false;
      this.envvars = [];
      this.maxEnvvars = 0;

      this.$scope.$on(this.Hosting.events.tabEnvvarsRefresh, () =>
        this.getIds(),
      );

      return this.getIds().then(() => this.loadCapabilities());
    }

    /**
     * Load all environment variables keys from API
     */
    getIds() {
      return this.HostingEnvvars.list(this.$stateParams.productId)
        .then((keys) => {
          if (!isArray(keys)) {
            throw this.$translate.instant(
              'hosting_tab_ENVVARS_list_error_temporary',
            );
          }

          this.envvars = keys.map((key) => ({ key }));
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('hosting_tab_ENVVARS_list_error') +
              err.message,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.hasResult = isArray(this.envvars) && !isEmpty(this.envvars);
          this.loading = false;
        });
    }

    /**
     * Load an environment variable given its key
     */
    getEnvvar(row) {
      return this.HostingEnvvars.get(this.$stateParams.productId, row.key).then(
        (envvar) => {
          const formattedEnvar = clone(envvar);
          formattedEnvar.loaded = true;

          return envvar;
        },
      );
    }

    canAddEnvvar() {
      return isArray(this.envvars) && this.envvars.length < this.maxEnvvars;
    }

    /**
     * Load offer capabilities to check if envvars can be added
     */
    loadCapabilities() {
      return this.Hosting.getSelected(this.$stateParams.productId)
        .then((hosting) => this.Hosting.getOfferCapabilities(hosting.offer))
        .then((capabilities) => {
          this.maxEnvvars = capabilities.envVars;
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('hosting_tab_RUNTIMES_error') + err.message,
            this.$scope.alerts.main,
          );
        });
    }
  },
);
