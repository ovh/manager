import first from 'lodash/first';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import {
  EXTRA_SQL_PERSO,
  MAX_USER_LENGTH,
} from './hosting-database-add.constants';

angular
  .module('App')
  .controller(
    'HostingDatabaseCreateCtrl',
    (
      $location,
      $scope,
      $stateParams,
      $timeout,
      $translate,
      Alerter,
      Hosting,
      HostingDatabase,
      OvhApiHostingWeb,
      User,
    ) => {
      $scope.primaryLogin = $scope.hosting.primaryLogin;
      $scope.maxUserLength = MAX_USER_LENGTH - $scope.primaryLogin.length;

      User.getUrlOf('guides').then((guides) => {
        if (guides && guides.hostingPrivateDatabase) {
          $scope.guide = guides.hostingPrivateDatabase;
        }
      });

      const isPasswordValid = () =>
        $scope.model.password.value &&
        $scope.model.password.confirmation &&
        $scope.model.password.value === $scope.model.password.confirmation &&
        Hosting.constructor.isPasswordValid(
          $scope.model.password.value,
          $scope.customPasswordConditions,
        );

      $scope.model = {
        capability: null,
        type: null,
        version: null,
        quota: null,
        user: null,
        password: {
          value: null,
          confirmation: null,
        },
      };

      $scope.customPasswordConditions = {
        max: 30,
      };

      $scope.load = () =>
        OvhApiHostingWeb.v6()
          .getDatabaseCreationCapabilities({
            serviceName: $stateParams.productId,
          })
          .$promise.then((capabilities) => {
            $scope.capabilities = map(capabilities, (capability) => ({
              ...capability,
              snakeCasedType: snakeCase(capability.type),
            }));

            $scope.model.capability = first($scope.capabilities);
            $scope.model.type = first($scope.model.capability.engines);

            // load available versions
            return $scope.loadAvailableDatabaseVersions();
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          });

      $scope.loadAvailableDatabaseVersions = () =>
        OvhApiHostingWeb.v6()
          .getDatabaseAvailableVersion({
            serviceName: $stateParams.productId,
            type: $scope.model.type,
          })
          .$promise.then((response) => {
            $scope.dbVersions = response.list;
            $scope.model.version = response.default;
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          });

      $scope.isStep1Valid = () =>
        $scope.model.type !== null && $scope.model.capability !== null;

      $scope.isStep2Valid = () => isPasswordValid() && $scope.isUserValid();

      $scope.shouldDisplayDifferentPasswordMessage = () =>
        $scope.model.password.value &&
        $scope.model.password.confirmation &&
        $scope.model.password.value !== $scope.model.password.confirmation;

      $scope.condition = Hosting.constructor.getPasswordConditions(
        $scope.customPasswordConditions,
      );

      $scope.isPasswordInvalid = () =>
        !Hosting.constructor.isPasswordValid(
          get($scope.model, 'password.value'),
          $scope.customPasswordConditions,
        );

      $scope.isPasswordConfirmationInvalid = () =>
        Hosting.constructor.isPasswordValid(
          get($scope.model, 'password.confirmation'),
          $scope.customPasswordConditions,
        ) && !$scope.shouldDisplayDifferentPasswordMessage()
          ? ''
          : 'has-error';

      $scope.isUserValid = () =>
        !isNil($scope.model.user) &&
        $scope.model.user.length > 0 &&
        $scope.model.user.length <= $scope.maxUserLength &&
        /^[a-z0-9]+$/.test($scope.model.user);

      $scope.createDatabase = () =>
        OvhApiHostingWeb.Database()
          .v6()
          .save(
            {
              serviceName: $stateParams.productId,
            },
            {
              capabilitie: $scope.model.capability.type,
              password: $scope.model.password.value,
              quota:
                $scope.model.capability.type === EXTRA_SQL_PERSO
                  ? $scope.model.capability.quota.value
                  : null,
              type: $scope.model.type,
              user: `${$scope.primaryLogin}${$scope.model.user || ''}`,
              version: $scope.model.version,
            },
          )
          .$promise.then((task) => {
            HostingDatabase.pollTasks($stateParams.productId, {
              namespace: Hosting.events.tabDatabasesCreation,
              task,
              dump: 'hosting',
              successSates: ['canceled', 'done'],
              errorsSates: ['error'],
            });

            Alerter.success(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_bdd_adding',
              ),
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_fail',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.resetAction();
          });

      $scope.isPerf = () => /^PERF/.test($scope.hosting.offer);

      $scope.isPro = () => /^PRO/.test($scope.hosting.offer);

      $scope.isPerso = () => /^PERSO/.test($scope.hosting.offer);

      $scope.isStart = () => /^START/.test($scope.hosting.offer);

      $scope.buyPrivateDb = () => {
        $scope.resetAction();
        $timeout(() => {
          $location.path('/configuration/private_database');
        }, 300);
      };
    },
  );
