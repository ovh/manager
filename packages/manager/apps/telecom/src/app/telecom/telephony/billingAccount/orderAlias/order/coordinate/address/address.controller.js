import get from 'lodash/get';

export default /* @ngInject */ function AddressController(
  $scope,
  OvhApiNewAccount,
) {
  const self = this;

  this.validator = {
    isZipcode() {
      return true;
    },
  };

  this.getValidator = function getValidator() {
    if (this.regionCode) {
      OvhApiNewAccount.CreationRules()
        .v6()
        .get({
          country:
            this.regionCode === 'uk' ? 'GB' : this.regionCode.toUpperCase(),
          legalform: 'corporation',
          ovhCompany: 'ovh',
          ovhSubsidiary: 'FR',
        })
        .$promise.then((rules) => {
          const zipCodeRegexp = get(rules, 'zip.regularExpression');
          if (zipCodeRegexp) {
            self.validator.isZipcode = function isZipcode(value) {
              return new RegExp(zipCodeRegexp).test(value);
            };
          }
          return self.validator;
        });
    }
  };

  $scope.$watch('$ctrl.regionCode', (newVal, oldVal) => {
    if (newVal !== oldVal) {
      self.getValidator();
    }
  });

  this.$onInit = function $onInit() {
    return this.getValidator();
  };
}
