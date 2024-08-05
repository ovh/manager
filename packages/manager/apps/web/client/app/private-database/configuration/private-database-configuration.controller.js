import clone from 'lodash/clone';
import includes from 'lodash/includes';

angular.module('App').controller(
  'PrivateDatabaseConfigurationsCtrl',
  class PrivateDatabaseConfigurationsCtrl {
    /* @ngInject */
    constructor(
      Alerter,
      PrivateDatabase,
      $q,
      $scope,
      $stateParams,
      $translate,
      WucUser,
    ) {
      this.alerter = Alerter;
      this.privateDatabaseService = PrivateDatabase;
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.userService = WucUser;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;

      this.database = this.$scope.database;
      this.loading = false;
      this.edit = {
        value: false,
      };

      this.getConfigurationDetails();

      this.userService.getUrlOf('guides').then((guide) => {
        if (guide.hostingPrivateDatabaseConfiguration) {
          this.configuration_guide = guide.hostingPrivateDatabaseConfiguration;
        }
      });
    }

    getConfigurationDetails() {
      this.loading = true;
      return this.privateDatabaseService
        .getConfigurationDetails(this.productId)
        .then((config) => {
          this.configurations = config.details.map((field) =>
            this.convertAvailableValues(field),
          );
        })
        .catch((error) => {
          this.alerter.error(
            this.$translate.instant('privateDatabase_configuration_error'),
            this.$scope.alerts.main,
          );
          return this.$q.reject(error);
        })
        .finally(() => {
          this.loading = false;
        });
    }

    convertAvailableValues(opts) {
      const field = clone(opts);

      field.description = this.getFieldDescriptionTranslated(field);
      field.availableValues = field.availableValues.map((value) => ({
        id: value,
        text: value,
      }));

      if (field.key === 'sql_mode') {
        field.type = 'select';

        field.availableValues = field.availableValues.map((value) => {
          return {
            id: value.id,
            text: `${
              value.id === field.defaultValue ? `Default` : `Legacy`
            } SQL Mode: ${value.id}`,
          };
        });

        field.selectedValue = field.availableValues.find(
          (value) => value.id === field.value,
        );
      } else if (field.key === 'innodb_buffer_pool_size') {
        field.type = 'select';

        Object.keys(field.availableValues).forEach((key) => {
          if (
            Number(field.availableValues[key].text.slice(0, -1)) >=
            Number(this.database.ram.value)
          ) {
            delete field.availableValues[key];
          }
        });

        field.selectedValue = field.availableValues.find(
          (value) => value.id === field.value,
        );
      } else if (field.availableValues.length === 2) {
        field.type = 'toggle';
        field.selectedValue = { id: field.value };
      } else {
        field.type = 'select';
        field.selectedValue = field.availableValues.find(
          (value) => value.id === field.value,
        );
      }

      return field;
    }

    getFieldDescriptionTranslated(field) {
      const translationId = `privateDatabase_configuration_field_${field.key}`;
      const description = this.$translate.instant(translationId);
      if (includes(description, translationId)) {
        return field.description;
      }

      return description;
    }

    updateConfigurations() {
      if (this.dbConfigurationForm.$invalid) {
        return this.$q.reject();
      }
      this.loading = true;
      this.edit.value = false;
      const parameters = this.configurations.map((conf) => ({
        key: conf.key,
        value: conf.selectedValue.id,
      }));

      return this.privateDatabaseService
        .changeConfigurationDetails(this.productId, { parameters })
        .then(() => {
          this.alerter.success(
            this.$translate.instant('privateDatabase_configuration_reboot'),
            this.$scope.alerts.main,
          );
          return this.privateDatabaseService.pollConfigurationChange(
            this.productId,
          );
        })
        .then(() => {
          this.alerter.success(
            this.$translate.instant('privateDatabase_configuration_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((error) => {
          this.alerter.error(
            this.$translate.instant('privateDatabase_configuration_error_put'),
            this.$scope.alerts.main,
          );
          return this.$q.reject(error);
        })
        .finally(() => {
          this.edit.value = false;
          this.loading = false;
          this.getConfigurationDetails();
        });
    }
  },
);
