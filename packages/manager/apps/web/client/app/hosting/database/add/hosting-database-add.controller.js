angular
  .module('App')
  .controller(
    'HostingDatabaseCreateCtrl',
    (
      $location,
      $q,
      $scope,
      $state,
      $stateParams,
      $timeout,
      $translate,
      Alerter,
      Hosting,
      HostingDatabase,
      User,
    ) => {
      const MAX_USER_LENGTH = 16;

      User.getUrlOf('guides').then((guides) => {
        if (guides && guides.hostingPrivateDatabase) {
          $scope.guide = guides.hostingPrivateDatabase;
        }
      });

      const isPasswordValid = () => $scope.model.selected.password.value
        && $scope.model.selected.password.confirmation
        && $scope.model.selected.password.value
          === $scope.model.selected.password.confirmation
        && Hosting.constructor.isPasswordValid(
          $scope.model.selected.password.value,
          $scope.customPasswordConditions,
        );

      function getAvailableVersion(type) {
        $scope.model.capabilities.bdVersions = null;
        $scope.model.selected.version = null;
        HostingDatabase.getAvailableVersion($stateParams.productId, type).then((result) => {
          $scope.model.capabilities.bdVersions = result.list;
          $scope.model.selected.version = _.find(
            $scope.model.capabilities.bdVersions,
            elt => elt === result.default,
          );
        }); // no need error function
      }

      $scope.$watch('model.selected.type', () => {
        if ($scope.model.selected.type) {
          getAvailableVersion($scope.model.selected.type.toLowerCase());
        }
      });

      $scope.model = {
        capabilities: null,
        selected: {
          type: null,
          capabilitie: null,
          password: {
            value: null,
            confirmation: null,
          },
          quota: null,
          user: '',
        },
        types: {
          EXTRA_SQL_PERSO: 'EXTRA_SQL_PERSO',
        },
        maxUserLength: 6,
      };

      $scope.customPasswordConditions = {
        max: 30,
      };

      $scope.load = () => {
        $q.all({
          capabilities: HostingDatabase.getCreationCapabilities($stateParams.productId),
          availableDatabasesType: HostingDatabase.getDatabaseAvailableType($stateParams.productId),
        })
          .then((resp) => {
            $scope.model.capabilities = resp.capabilities;
            $scope.model.maxUserLength = MAX_USER_LENGTH - resp.capabilities.primaryLogin.length;

            if (resp.capabilities.availableDatabases.length === 1) {
              [
                $scope.model.selected.capabilitie,
              ] = resp.capabilities.availableDatabases;
            }

            $scope.availableDatabasesType = resp.availableDatabasesType;
            $scope.model.selected.type = 'MYSQL';
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_DATABASES_configuration_create_step1_loading_error'),
              _.get(err, 'data', err),
              $scope.alerts.main,
            );
          });
      };

      $scope.isStep1Valid = () => $scope.model.selected.type !== null
        && $scope.model.selected.capabilitie !== null;

      $scope.isStep2Valid = () => isPasswordValid() && $scope.isUserValid();

      $scope.shouldDisplayDifferentPasswordMessage = () => $scope.model.selected.password.value
        && $scope.model.selected.password.confirmation
        && $scope.model.selected.password.value
          !== $scope.model.selected.password.confirmation;

      $scope.condition = Hosting.constructor.getPasswordConditions($scope.customPasswordConditions);

      $scope.isPasswordInvalid = () => !Hosting.constructor.isPasswordValid(
        _.get($scope.model, 'selected.password.value'),
        $scope.customPasswordConditions,
      );

      $scope.isPasswordConfirmationInvalid = () => (Hosting.constructor.isPasswordValid(
        _.get($scope.model, 'selected.password.confirmation'),
        $scope.customPasswordConditions,
      ) && !$scope.shouldDisplayDifferentPasswordMessage()
        ? ''
        : 'has-error');

      $scope.isUserValid = () => $scope.model.selected.user !== undefined
        && $scope.model.selected.user.length > 0
        && $scope.model.selected.user.length <= $scope.model.maxUserLength
        && /^[a-z0-9]+$/.test($scope.model.selected.user);

      function convertEnumToString(e) {
        const enumTab = e.toLowerCase().split('_');
        $.each(enumTab, (index, subString) => {
          if (index > 0) {
            enumTab[index] = subString.charAt(0).toUpperCase() + subString.slice(1);
          }
        });
        return enumTab.join('');
      }

      $scope.createDatabase = () => {
        $scope.resetAction();
        HostingDatabase.createDatabase(
          $stateParams.productId,
          convertEnumToString($scope.model.selected.capabilitie.type),
          $scope.model.selected.password.value,
          $scope.model.selected.capabilitie.type
          === $scope.model.types.EXTRA_SQL_PERSO
            ? convertEnumToString($scope.model.selected.capabilitie.extraSqlQuota)
            : null,
          convertEnumToString($scope.model.selected.type),
          $scope.model.capabilities.primaryLogin
            + ($scope.model.selected.user === null
              ? ''
              : $scope.model.selected.user),
          $scope.model.selected.version,
        )
          .then(() => {
            Alerter.success(
              $translate.instant('hosting_tab_DATABASES_configuration_create_bdd_adding'),
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_DATABASES_configuration_create_fail'),
              _.get(err, 'data', err),
              $scope.alerts.main,
            );
          });
      };

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
