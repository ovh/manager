import set from 'lodash/set';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  EmailPro,
  EmailProExternalContacts,
) => {
  $scope.model = {
    externalEmailAddress: $scope.currentActionData,
  };

  $scope.deleteAccount = function deleteAccount() {
    $scope.resetAction();
    EmailProExternalContacts.removeContact(
      $stateParams.organization,
      $stateParams.productId,
      $scope.model.externalEmailAddress,
    )
      .then(() => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_delete_success',
          ),
          { status: 'success' },
        );
      })
      .catch((err) => {
        set(err, 'status', err.status || 'error');
        $scope.setMessage(
          $translate.instant(
            'emailpro_tab_EXTERNAL_CONTACTS_configuration_contact_delete_fail',
          ),
          err,
        );
      });
  };
};
