export default /* @ngInject */ (
  $scope,
  $stateParams,
  EmailPro,
  EmailProExternalContacts,
  $timeout,
) => {
  $scope.contactsLoading = false;
  $scope.contacts = null;
  $scope.filter = null;

  $scope.$watch(
    'filter',
    (newValue) => {
      if ($scope.filter !== null) {
        if ($scope.filter === '') {
          $scope.$broadcast(
            'paginationServerSide.loadPage',
            1,
            'externalContactsTable',
          );
        } else {
          $timeout(() => {
            if ($scope.filter === newValue) {
              $scope.$broadcast(
                'paginationServerSide.loadPage',
                1,
                'externalContactsTable',
              );
            }
          }, 500);
        }
      }
    },
    true,
  );

  $scope.getStateClassFor = function getStateClassFor(state) {
    switch (state) {
      case 'CREATING':
      case 'REOPENING':
        return 'oui-badge_info';
      case 'DELETING':
        return 'oui-badge_warning';
      case 'SUSPENDED':
      case 'SUSPENDING':
        return 'oui-badge_error';
      default:
    }
    return null;
  };

  $scope.emptySearch = function emptySearch() {
    $scope.filter = '';
    $scope.loadContacts();
  };

  $scope.loadContacts = function loadContacts(count, offset) {
    $scope.contactsLoading = true;
    EmailProExternalContacts.getContacts(
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

  $scope.deleteExternalContact = function deleteExternalContact(element) {
    if (!element.taskPendingId) {
      $scope.setAction(
        'emailpro/external-contact/remove/emailpro-external-contact-remove',
        element.externalEmailAddress,
      );
    }
  };

  $scope.modifyExternalContact = function modifyExternalContact(element) {
    if (!element.taskPendingId) {
      $scope.setAction(
        'emailpro/external-contact/update/emailpro-external-contact-update',
        element,
      );
    }
  };

  $scope.$on(EmailPro.events.externalcontactsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'externalContactsTable');
  });

  $scope.getIsDisabled = function getIsDisabled(account) {
    return !!account.taskPendingId;
  };
};
