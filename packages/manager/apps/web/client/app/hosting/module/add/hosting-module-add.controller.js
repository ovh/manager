import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import validator from 'validator';

angular
  .module('App')
  .controller(
    'HostingModuleCreateCtrl',
    (
      $scope,
      $q,
      $stateParams,
      $translate,
      Alerter,
      constants,
      Hosting,
      HostingModule,
      HOSTING_MODULE,
    ) => {
      $scope.model = {
        databases: null,
        moduleTemplates: null,
        templateSelected: null,
        databaseSelected: {
          type: 'mysql',
        },
        databaseHostedSelected: null,
        adminName: '',
        adminPassword: '',
        adminPasswordConfirm: '',
        domain: '',
        language: '',
        path: '',
        minPasswdLength: HOSTING_MODULE.admin.password.minLength,
        maxPasswdLength: HOSTING_MODULE.admin.password.maxLength,
        databasePasswordMinLength: HOSTING_MODULE.database.password.minLength,
        databasePasswordMaxLength: HOSTING_MODULE.database.password.maxLength,
      };

      $scope.loading = {
        templates: false,
        databases: false,
        domains: false,
      };

      $scope.rootPathPrefix = './';
      $scope.defaultInstallationPath =
        constants.HOSTING.MODULES.DEFAULT_INSTALL_PATH;

      $scope.advancedMode = {
        value: false,
      };

      function generateDatabasePrefix(moduleName) {
        return `${[
          moduleName.substring(0, 3),
          Math.floor(Math.random() * 10000 + 1),
        ].join('')}_`;
      }

      //--------------------------------
      // Step 1 : Select module template
      //--------------------------------
      $scope.loadModuleTemplates = () => {
        $scope.loadDomains();

        HostingModule.getModulesLatestList().then(
          (moduleTemplates) => {
            $q.all(
              moduleTemplates.map((id) => HostingModule.getAvailableModule(id)),
            ).then(
              (templates) => {
                $scope.model.moduleTemplates = templates.filter(
                  (tpl) => tpl.branch === 'stable',
                );
                $scope.databasesType = moduleTemplates.databasesType;
              },
              (err) => {
                Alerter.alertFromSWS(
                  $translate.instant(
                    'hosting_tab_DATABASES_configuration_create_step1_loading_error',
                  ),
                  err,
                  $scope.alerts.main,
                );
                $scope.resetActions();
              },
            );
          },
          (err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              err,
              $scope.alerts.main,
            );
            $scope.resetActions();
          },
        );
      };

      $scope.onNextStep = () => {
        if (!$scope.advancedMode.value) {
          $scope.resetAction();

          HostingModule.createModule($stateParams.productId, {
            moduleId: $scope.model.templateSelected.id,
            domain: $scope.model.domain,
            path: [$scope.pathPrefix, $scope.model.path].join(''),
          }).then(
            () => {
              Alerter.success(
                $translate.instant(
                  'hosting_configuration_tab_modules_create_success',
                ),
                $scope.alerts.main,
              );
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant(
                  'hosting_tab_DATABASES_configuration_create_step1_loading_error',
                ),
                err,
                $scope.alerts.main,
              );
            },
          );
        }
      };

      //------------------------
      // Step 2 : Select database
      //------------------------
      function isPortValid() {
        const port = parseInt($scope.model.databaseSelected.port, 10);
        return (
          $scope.model.databaseSelected.port.toString().match(/^\d+$/) &&
          port >= 1024 &&
          port <= 49151
        );
      }

      $scope.$watch('model.databaseSelected.port', () => {
        if ($scope.model.databaseSelected.port) {
          $scope.portValid = isPortValid();
        } else {
          $scope.portValid = true;
        }
      });

      $scope.loadDatabases = () => {
        $scope.loading.databases = true;
        HostingModule.getDatabases($stateParams.productId)
          .then((databases) => {
            $scope.model.databases = databases;
            if (isArray(databases) && !isEmpty(databases)) {
              [$scope.model.databaseHostedSelected] = databases;
              $scope.selectDatabase();
            }
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
          })
          .finally(() => {
            $scope.loading.databases = false;
          });
      };

      $scope.selectDatabase = () => {
        if (!$scope.model.databaseHostedSelected) {
          $scope.model.databaseSelected = { type: 'mysql' };
          return;
        }

        $scope.loading.databaseInfos = true;
        HostingModule.getDatabase(
          $stateParams.productId,
          $scope.model.databaseHostedSelected,
        )
          .then((database) => {
            $scope.model.databaseSelected = {
              name: database.user,
              port: database.port,
              server: database.name,
              type: database.type,
              user: database.user,
            };
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
            $scope.resetAction();
          })
          .finally(() => {
            $scope.loading.databaseInfos = false;
          });
      };

      $scope.isStep2Valid = () =>
        $scope.model.databaseSelected &&
        !!$scope.model.databaseSelected.name &&
        !!$scope.model.databaseSelected.port &&
        !!$scope.model.databaseSelected.server &&
        !!$scope.model.databaseSelected.type &&
        !!$scope.model.databaseSelected.user &&
        !!$scope.model.databaseSelected.password &&
        isPortValid();

      //------------------------
      // Step 3 : Module details
      //------------------------
      $scope.loadDomains = () => {
        $scope.loading.domains = true;

        HostingModule.getAttachedDomains($stateParams.productId)
          .then((domains) => {
            $scope.loading.domains = false;
            $scope.model.domains = domains;
            HostingModule.getService($stateParams.productId).then(
              (service) => {
                if ($scope.model.domains.indexOf(service.serviceName) !== -1) {
                  $scope.model.domain = service.serviceName;
                }
              },
              (err) => {
                Alerter.alertFromSWS(
                  $translate.instant(
                    'hosting_tab_DATABASES_configuration_create_step1_loading_error',
                  ),
                  get(err, 'data', err),
                  $scope.alerts.main,
                );
              },
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
            $scope.loading.domains = false;
            $scope.resetAction();
          });
      };

      function isAdminNameValid() {
        let syntaxOk = /^[\w-.]+$/.test($scope.model.adminName);
        if (
          !!$scope.model.templateSelected &&
          $scope.model.templateSelected.adminNameType === 'email'
        ) {
          syntaxOk = validator.isEmail($scope.model.adminName);
        }
        return syntaxOk;
      }

      function isPathValid() {
        return Hosting.constructor.isPathValid($scope.model.path);
      }

      function isPasswordValid() {
        return Hosting.constructor.isPasswordValid($scope.model.adminPassword);
      }

      function modulePasswordMatch() {
        return (
          !!$scope.model.adminPassword &&
          !!$scope.model.adminPasswordConfirm &&
          $scope.model.adminPassword === $scope.model.adminPasswordConfirm
        );
      }

      function checkAdminPassword() {
        $scope.adminPassValid = true;
        $scope.adminPassMatchValid = true;

        if ($scope.model.adminPassword) {
          if (!isPasswordValid()) {
            $scope.adminPassValid = false;
            return;
          }
        }

        if ($scope.model.adminPasswordConfirm) {
          if (!modulePasswordMatch()) {
            $scope.adminPassMatchValid = false;
          }
        }
      }

      $scope.$watch('model.adminPassword', checkAdminPassword);
      $scope.$watch('model.adminPasswordConfirm', checkAdminPassword);

      $scope.$watch('model.adminName', () => {
        $scope.adminNameValid = true;
        if ($scope.model.adminName) {
          $scope.adminNameValid = isAdminNameValid();
        }
      });

      $scope.$watch('model.path', () => {
        $scope.pathValid = true;
        if ($scope.model.path) {
          $scope.pathValid = isPathValid();
        }
      });

      $scope.$watch('model.domain', () => {
        if (!$scope.model.domain) {
          return null;
        }

        if ($scope.model.domain === $scope.userClusterDomain) {
          $scope.rootPathPrefix = '';
          $scope.pathPrefix = 'www/';
          $scope.defaultInstallationPath = $scope.pathPrefix;
          return null;
        }

        return HostingModule.getAttachedDomainPath(
          $stateParams.productId,
          $scope.model.domain,
        )
          .then((domain) => {
            $scope.loading.domains = false;
            $scope.pathPrefix = /\/$/.test(domain.path)
              ? domain.path
              : `${domain.path}/`;

            if (/^[/.]/.test($scope.pathPrefix)) {
              $scope.rootPathPrefix = '';
            }
            $scope.defaultInstallationPath = [
              $scope.rootPathPrefix,
              $scope.pathPrefix,
              $scope.model.path,
            ].join('');
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              get(err, 'data', err),
              $scope.alerts.main,
            );
            $scope.loading.domains = false;
            $scope.resetAction();
          });
      });

      $scope.isStep3Valid = () =>
        !!$scope.model.adminName &&
        !!$scope.model.adminPassword &&
        !!$scope.model.language &&
        !!$scope.model.domain &&
        isAdminNameValid() &&
        isPasswordValid() &&
        modulePasswordMatch();

      //------------------------
      // Step 4 : Module details
      //------------------------

      $scope.createModule = () => {
        $scope.resetAction();
        const data = {
          moduleId: $scope.model.templateSelected.id,
          adminName: $scope.model.adminName,
          adminPassword: $scope.model.adminPassword,
          path: [$scope.pathPrefix, $scope.model.path].join(''),
          domain: $scope.model.domain,
          dependencies: [
            {
              port: $scope.model.databaseSelected.port,
              prefix: generateDatabasePrefix(
                $scope.model.templateSelected.name,
              ),
              name: $scope.model.databaseSelected.name,
              server: $scope.model.databaseSelected.server,
              type: $scope.model.databaseSelected.type,
              user: $scope.model.databaseSelected.user,
              password: $scope.model.databaseSelected.password,
            },
          ],
          language: $scope.model.language,
        };
        HostingModule.createModule($stateParams.productId, data)
          .then(() => {
            Alerter.success(
              $translate.instant(
                'hosting_configuration_tab_modules_create_success',
              ),
              $scope.alerts.main,
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant(
                'hosting_tab_DATABASES_configuration_create_step1_loading_error',
              ),
              err,
              $scope.alerts.main,
            );
          });
      };
    },
  );
