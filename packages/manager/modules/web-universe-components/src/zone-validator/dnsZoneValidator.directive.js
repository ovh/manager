/* eslint-disable no-param-reassign */
export default /* @ngInject */ ($q, newDnsZone) => ({
  require: 'ngModel',
  link(scope, element, attrs, ngModel) {
    ngModel.$asyncValidators.zoneName = (modelValue, viewValue) => {
      const value = modelValue || viewValue;
      if (!value) {
        return $q.when(true);
      }

      const deferred = $q.defer();

      newDnsZone.getZoneNameValidation(value).then(
        (response) => {
          scope.data[response.details[0].domain] = response;
          deferred.resolve(response);
        },
        (err) => {
          deferred.reject(err);
        },
      );

      return deferred.promise;
    };
  },
});
/* eslint-enable no-param-reassign */
