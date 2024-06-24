import { CONFIGURATION_TYPES } from '../../../domain-dns-modify.constants';
import { isInternalDns } from './add-dns-form.constants';

export function hostnameValidator(WucValidator) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link(scope, _, __, ngModelController) {
      if (!ngModelController) {
        return;
      }
      const ngModel = ngModelController;

      const validatePattern = (modelValue, viewValue) => {
        ngModel.$setValidity('hostnamePattern', true);

        if (ngModel.$isEmpty(modelValue)) {
          ngModel.$setUntouched();
          return true;
        }

        if (!WucValidator.isValidDomain(viewValue)) {
          ngModel.$setValidity('hostnamePattern', false);
          return false;
        }

        return true;
      };
      ngModel.$validators.hostnamePattern = validatePattern;

      const validateExternal = (modelValue, viewValue) => {
        ngModel.$setValidity('hostnameExternal', true);

        if (ngModel.$isEmpty(modelValue)) {
          ngModel.$setUntouched();
          return true;
        }

        if (scope.configurationType !== CONFIGURATION_TYPES.EXTERNAL) {
          return true;
        }

        const isInternal = isInternalDns(viewValue);
        if (isInternal) {
          ngModel.$setValidity('hostnameExternal', false);
          return false;
        }

        return true;
      };
      ngModel.$validators.hostnameExternal = validateExternal;

      const validateUniqueness = (modelValue, viewValue) => {
        ngModel.$setValidity('hostnameUnique', true);

        if (ngModel.$isEmpty(modelValue)) {
          ngModel.$setUntouched();
          return true;
        }

        const modifiedDnsList = scope.modifiedDnsList || [];
        const isDuplicated = modifiedDnsList.some(
          (ns) => ns.nameServer === viewValue,
        );

        if (isDuplicated) {
          ngModel.$setValidity('hostnameUnique', false);
          return false;
        }

        return true;
      };
      ngModel.$validators.hostnameUnique = validateUniqueness;
    },
  };
}

export function ipValidator(WucValidator) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link(scope, element, attrs, ngModelController) {
      if (!ngModelController) {
        return;
      }
      const ngModel = ngModelController;

      const validatePattern = (modelValue, viewValue) => {
        ngModel.$setValidity('ipPattern', true);

        if (ngModel.$isEmpty(modelValue)) {
          ngModel.$setUntouched();
          return true;
        }

        const isValidIp =
          WucValidator.isValidIpv4(viewValue) ||
          WucValidator.isValidIpv6(viewValue);
        if (!isValidIp) {
          ngModel.$setValidity('ipPattern', false);
          return false;
        }

        return true;
      };
      ngModel.$validators.ipPattern = validatePattern;
    },
  };
}
