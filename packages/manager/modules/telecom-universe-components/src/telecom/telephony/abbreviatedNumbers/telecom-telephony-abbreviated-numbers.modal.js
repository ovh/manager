import angular from 'angular';

export default /* @ngInject */ function (
  $q,
  $translate,
  $uibModalInstance,
  data,
) {
  const self = this;

  self.loading = {
    updating: false,
  };

  angular.extend(self, data);

  self.numberPattern = /^00\d{2,3}[\s\d]+$/;
  self.namePattern = /^[a-zA-Z0-9\s]*$/;

  self.cancel = function cancel() {
    $uibModalInstance.dismiss('cancel');
  };

  self.send = function send() {
    self.errorMessage = null;
    self.loading.updating = true;
    $q.when(self.saveCallback({ value: self.data }))
      .then(
        () => {
          $uibModalInstance.close(self.data);
        },
        (err) => {
          if (/^This abbreviated/.test(err.data.message)) {
            self.errorMessage = $translate.instant(
              'telephony_abbreviated_numbers_not_free_error',
            );
          } else {
            self.errorMessage = $translate.instant(
              'telephony_abbreviated_numbers_save_error',
            );
          }
          $q.reject(err);
        },
      )
      .finally(() => {
        self.loading.updating = false;
      });
  };
}
