import set from 'lodash/set';

export default /* @ngInject */ ($q, OvhApiValidateAapi, TelephonyMediator) => ({
  require: 'ngModel',
  link(scope, elm, attrs, ctrl) {
    /** Can't use isolate scope, $scompile.multidir* */
    let regionCode;
    let minLength;
    attrs.$observe('validationMinLength', (val) => {
      minLength = val;
    });
    attrs.$observe('regionCode', (val) => {
      regionCode = val;
    });

    set(ctrl, '$asyncValidators.phoneNumber', (modelValue, viewValue) => {
      /** If i have region, i have to use 2api */
      if (regionCode) {
        if (!modelValue || modelValue.length < minLength) {
          return $q.reject();
        }

        return OvhApiValidateAapi.phone({
          phoneNumber: viewValue,
          regionCode: attrs.regionCode,
        }).$promise;
      }

      /** Just use TelephonyMediator instead */
      return $q
        .when(TelephonyMediator.IsValidNumber(modelValue))
        .then((isValid) => {
          if (isValid) {
            return true;
          }
          return $q.reject(isValid);
        });
    });
  },
});
