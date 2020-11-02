import set from 'lodash/set';

angular
  .module('UserAccount')
  .controller('UserAccount.controllers.contacts.request', [
    '$scope',
    '$stateParams',
    '$translate',
    'UserAccount.services.Contacts',
    'Alerter',
    'User',
    function UserAccountContactsRequestController(
      $scope,
      $stateParams,
      $translate,
      Contacts,
      Alerter,
      User,
    ) {
      $scope.task = angular.copy($scope.currentActionData.task);
      $scope.action = $scope.currentActionData.action;
      $scope.method = $scope.currentActionData.method;
      $scope.token = {
        value: $stateParams.token,
      };

      const messages = {
        ACCEPT: {
          success: 'user_account_changecontact_accept_success',
          error: 'user_account_changecontact_accept_error',
        },
        REFUSE: {
          success: 'user_account_changecontact_refuse_success',
          error: 'user_account_changecontact_refuse_error',
        },
        RESEND: {
          success: 'user_account_changecontact_resend_success',
          error: 'user_account_changecontact_resend_error',
        },
      };

      const CONTACT_REQUEST_WIZARD_TITLES = {
        ACCEPT: 'user_account_changecontact_accept_title',
        REFUSE: 'user_account_changecontact_refuse_title',
        RESEND: 'user_account_changecontact_resend_title',
      };

      $scope.loaders = {
        loading: false,
      };

      $scope.getIcon = function getIcon() {
        switch ($scope.action) {
          case 'ACCEPT':
            return 'fa white fa-3x fa-check';
          case 'REFUSE':
            return 'fa white fa-3x fa-remove';
          case 'RESEND':
            return 'fa white fa-3x fa-envelope-o';
          default:
            return 'fa white fa-3x fa-info';
        }
      };

      $scope.getWizardTitle = function getWizardTitle() {
        return $translate.instant(CONTACT_REQUEST_WIZARD_TITLES[$scope.action]);
      };

      $scope.changeContactRequest = function changeContactRequest() {
        let promise = null;

        switch ($scope.action) {
          case 'ACCEPT':
            promise = Contacts.acceptRequest({
              id: $scope.task.id,
              token: $scope.token.value,
            });
            break;
          case 'REFUSE':
            promise = Contacts.refuseRequest({
              id: $scope.task.id,
              token: $scope.token.value,
            });
            break;
          case 'RESEND':
            promise = Contacts.resendRequest({ id: $scope.task.id });
            break;
          default:
            throw new Error(
              `Unsupported and unexpected contact request type ${$scope.action}`,
            );
        }

        $scope.loaders.loading = true;
        promise
          .then(
            () => {
              if ($scope.action !== 'RESEND') {
                Contacts.addPendingChange({
                  key: 'Contacts::PendingChangeSent',
                  data: [$scope.user.nichandle, $scope.task.id].join('_'),
                });
              }
              set($stateParams, 'taskId', null);
              set($stateParams, 'token', null);
              Alerter.success(
                $translate.instant(messages[$scope.action].success),
                'useraccount.alerts.dashboardContacts',
              );
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant(messages[$scope.action].error),
                err,
                'useraccount.alerts.dashboardContacts',
              );
            },
          )
          .finally(() => {
            $scope.loaders.loading = false;
            $scope.resetAction();
          });
      };

      function getUser() {
        User.getUser().then(
          (user) => {
            $scope.user = user;
          },
          (err) => {
            Alerter.alertFromSWS(
              $translate.instant('user_account_contacts_error'),
              err,
              'useraccount.alerts.dashboardContacts',
            );
          },
        );
      }

      if (!$scope.user) {
        getUser();
      }
    },
  ]);
