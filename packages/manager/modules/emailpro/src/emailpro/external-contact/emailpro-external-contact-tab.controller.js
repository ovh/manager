angular.module('Module.emailpro.controllers')
  .controller('EmailProTabExternalContactsCtrl', ($scope, $stateParams, EmailPro, EmailProExternalContacts, $timeout) => {
    $scope.contactsLoading = false;
    $scope.contacts = null;
    $scope.filter = null;

    $scope.$watch('filter', (newValue) => {
      if ($scope.filter !== null) {
        if ($scope.filter === '') {
          $scope.$broadcast('paginationServerSide.loadPage', 1, 'externalContactsTable');
        } else {
          $timeout(() => {
            if ($scope.filter === newValue) {
              $scope.$broadcast('paginationServerSide.loadPage', 1, 'externalContactsTable');
            }
          }, 500);
        }
      }
    }, true);

    $scope.getStateClassFor = function (state) {
      switch (state) {
        case 'CREATING':
        case 'REOPENING':
          return 'oui-status_info';
        case 'DELETING':
          return 'oui-status_warning';
        case 'SUSPENDED':
        case 'SUSPENDING':
          return 'oui-status_error';
        default:
      }
      return null;
    };

    $scope.emptySearch = function () {
      $scope.filter = '';
      $scope.loadContacts();
    };

    $scope.loadContacts = function (count, offset) {
      $scope.contactsLoading = true;
      EmailProExternalContacts
        .getContacts(
          $stateParams.organization,
          $stateParams.productId,
          count,
          offset,
          $scope.filter,
        )
        .then((contacts) => {
          $scope.contacts = contacts;
          $scope.contactsLoading = false;
        })
        .catch(() => {
          $scope.contactsLoading = false;
        });
    };

    $scope.deleteExternalContact = function (element) {
      if (!element.taskPendingId) {
        $scope.setAction('emailpro/external-contact/remove/emailpro-external-contact-remove', element.externalEmailAddress);
      }
    };

    $scope.modifyExternalContact = function (element) {
      if (!element.taskPendingId) {
        $scope.setAction('emailpro/external-contact/update/emailpro-external-contact-update', element);
      }
    };

    $scope.$on(EmailPro.events.externalcontactsChanged, () => {
      $scope.$broadcast('paginationServerSide.reload', 'externalContactsTable');
    });

    $scope.getIsDisabled = function (account) {
      return !!account.taskPendingId;
    };
  });
