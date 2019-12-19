import get from 'lodash/get';

angular
  .module('App')
  .controller(
    'HostingCronCreateCtrl',
    (
      $scope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingCron,
      WucCronValidator,
    ) => {
      const actionData = angular.copy($scope.currentActionData); // For edition

      $scope.loading = {
        init: false,
      };

      $scope.model = {
        emailSelect: 'no',
        status: 'disabled',
      };

      $scope.formatLanguage = (language) => HostingCron.formatLanguage(language);

      // Object used to communicate with the cronEditor directive.
      // See definition in cronEditor.controller.js.
      $scope.crontabObject = WucCronValidator.makeCrontabObject();

      $scope.isPathValid = () => Hosting.constructor.isPathValid($scope.selected.command);

      $scope.isValid = (step) => {
        switch (step) {
          case 1:
            return (
              $scope.selected.command
              && $scope.getSelectedCommand().length <= 100
              && $scope.isPathValid()
              && $scope.model.language
              && ($scope.model.emailSelect === 'other' ? $scope.model.email : true)
            );
          case 2:
            return (
              $scope.crontabObject.isValid && $scope.crontabObject.isValid()
            );
          default:
            return null;
        }
      };

      /*= =========  Final step  ========== */

      $scope.selected = {
        command: null,
      };

      $scope.getSelectedCommand = () => {
        let home;
        if ($scope.selected.command !== null) {
          if (
            /^\/.*/.test($scope.selected.command)
            || /^\.\/.*/.test($scope.selected.command)
          ) {
            home = $scope.selected.command;
          } else {
            home = `./${$scope.selected.command}`;
          }
        }
        return home;
      };

      $scope.generateCron = () => {
        $scope.model.command = $scope.getSelectedCommand();
        $scope.model.frequency = $scope.crontabObject.getCrontab();
      };

      $scope.getEmailResume = () => ($scope.model.emailSelect === 'other'
        ? $scope.model.email
        : $scope.model.emailSelect);

      $scope.saveCron = () => {
        $scope.loading.validation = true;

        // Set email value
        if ($scope.model.emailSelect !== 'other') {
          $scope.model.email = $scope.model.emailSelect;
        }

        // Add or Edit
        if (actionData.cron) {
          HostingCron.editCron(
            $stateParams.productId,
            actionData.cron.id,
            $scope.model,
          )
            .then(() => {
              Alerter.alertFromSWS(
                $translate.instant('hosting_tab_CRON_edit_success'),
                { idTask: 42, state: 'OK' },
                $scope.alerts.main,
              );
            })
            .catch((err) => {
              Alerter.alertFromSWS(
                $translate.instant('hosting_tab_CRON_edit_error', [
                  actionData.cron.id,
                ]),
                get(err, 'data', err),
                $scope.alerts.main,
              );
            })
            .finally(() => {
              $scope.resetAction();
            });
        } else {
          HostingCron.createCron($stateParams.productId, $scope.model)
            .then(() => {
              Alerter.alertFromSWS(
                $translate.instant('hosting_tab_CRON_save_success'),
                { idTask: 42, state: 'OK' },
                $scope.alerts.main,
              );
            })
            .catch((err) => {
              Alerter.alertFromSWS(
                $translate.instant('hosting_tab_CRON_save_error'),
                get(err, 'data', err),
                $scope.alerts.main,
              );
            })
            .finally(() => {
              $scope.resetAction();
            });
        }
      };

      $scope.trEnum = (str) => HostingCron.trEnum(str);

      /*= =========  INIT  ========== */

      $scope.init = () => {
        $scope.loading.init = true;
        $scope.title = actionData.cron
          ? $translate.instant('hosting_tab_CRON_configuration_edit_title_button')
          : $translate.instant('hosting_tab_CRON_configuration_create_title_button');

        // Edition
        if (actionData.cron) {
          $scope.selected.command = actionData.cron.command.replace(
            /^\.\//,
            '',
          );
          $scope.model.language = actionData.cron.language;
          $scope.model.description = actionData.cron.description;
          $scope.model.status = actionData.cron.status;
          switch (actionData.cron.email) {
            case 'no':
            case 'nic-admin':
            case 'nic-tech':
              $scope.model.emailSelect = actionData.cron.email;
              break;
            default:
              $scope.model.emailSelect = 'other';
              $scope.model.email = actionData.cron.email;
          }

          $scope.crontabObject.setCrontab(actionData.cron.frequency);
        }

        Hosting.getModels()
          .then((models) => {
            $scope.statusEnum = models.models['hosting.web.cron.StatusEnum'].enum;
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_CRON_error'),
              get(err, 'data', err),
              $scope.alerts.main,
            );
            $scope.resetAction();
          })
          .finally(() => {
            $scope.loading.init = false;
          });

        HostingCron.getAvailableLanguage($stateParams.productId)
          .then((languages) => {
            $scope.languageEnum = languages.reverse();
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_CRON_error'),
              err,
              $scope.alerts.main,
            );
            $scope.resetAction();
          });
      };
    },
  );
