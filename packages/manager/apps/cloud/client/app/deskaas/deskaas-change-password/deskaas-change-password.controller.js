import forEach from 'lodash/forEach';

angular
  .module('managerApp')
  .controller('DeskaasChangePasswordCtrl', function DeskaasChangePasswordCtrl(
    $uibModalInstance,
    OvhApiDeskaasService,
    service,
  ) {
    const self = this;

    self.policies = {};

    self.values = {
      password: '',
      generatePwd: false,
    };

    self.flags = {
      init: false,
    };

    self.cancel = function cancel() {
      $uibModalInstance.dismiss('cancel');
    };

    self.ok = function ok() {
      if (!self.values.generatePwd && !self.values.password) {
        $uibModalInstance.dismiss('cancel');
        return;
      }

      $uibModalInstance.close(self.values);
    };

    function createExpression(policies) {
      let exp = '';

      // lookaheads to enforce mandatory patterns
      if (policies.letterMandatory) {
        exp += '(?=.*[a-zA-Z])';
      }

      if (policies.lowercaseLetterMandatory) {
        exp += '(?=.*[a-z])';
      }

      if (policies.uppercaseLetterMandatory) {
        exp += '(?=.*[A-Z])';
      }

      if (policies.digitMandatory) {
        exp += '(?=.*\\d)';
      }

      exp += '[^';

      // match to filter on invalid chars and length
      if (policies.deniedChars && policies.deniedChars.length > 0) {
        forEach(policies.deniedChars, (char) => {
          exp += `\\x${char.charCodeAt(0).toString(16)}`;
        });
      }

      exp += `\\s]{${policies.minLength},${policies.maxLength}}`;

      return exp;
    }

    function init() {
      self.flags.init = true;

      OvhApiDeskaasService.v6()
        .getPwdPolicy({ serviceName: service }, null)
        .$promise.then((policies) => {
          self.policies = policies;

          self.policies.deniedCharsString = policies.deniedChars.join(', ');
          self.policies.pattern = createExpression(policies);
        })
        .finally(() => {
          self.flags.init = false;
        });
    }

    init();
  });
