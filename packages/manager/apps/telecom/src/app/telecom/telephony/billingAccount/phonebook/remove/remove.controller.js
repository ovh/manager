export default /* @ngInject */ function TelecomTelephonyBillingAccountPhonebookRemoveCtrl(
  $q,
  $stateParams,
  $timeout,
  $uibModalInstance,
  OvhApiTelephony,
  phonebook,
) {
  const self = this;

  self.isRemoving = false;
  self.removed = false;
  self.phonebook = angular.copy(phonebook);

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.remove = function remove() {
    self.isRemoving = true;
    return $q
      .all([
        OvhApiTelephony.Phonebook()
          .v6()
          .remove({
            billingAccount: $stateParams.billingAccount,
            bookKey: self.phonebook.bookKey,
          }).$promise,
        $timeout(angular.noop, 1000),
      ])
      .then(
        () => {
          self.isRemoving = false;
          self.removed = true;
          return $timeout(self.close, 1500);
        },
        (error) =>
          self.cancel({
            type: 'API',
            msg: error,
          }),
      );
  };

  self.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function close() {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------*/
}
