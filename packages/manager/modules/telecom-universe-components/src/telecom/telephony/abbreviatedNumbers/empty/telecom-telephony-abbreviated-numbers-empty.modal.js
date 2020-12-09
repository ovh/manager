import angular from 'angular';
import map from 'lodash/map';

export default /* @ngInject */ function ($q, $uibModalInstance, data) {
  const self = this;

  this.loading = {
    updating: false,
  };

  angular.extend(this, data);

  this.cancel = function cancel() {
    $uibModalInstance.dismiss('cancel');
  };

  this.send = function send() {
    this.removing = true;
    this.total = this.abbreviatedNumbers.length;
    this.progress = 0;
    return $q
      .all(
        map(self.abbreviatedNumbers, (elt) =>
          $q.when(self.removeCallback({ value: elt })).finally(() => {
            self.progress += 1;
          }),
        ),
      )
      .finally(() => {
        $uibModalInstance.close();
      });
  };
}
