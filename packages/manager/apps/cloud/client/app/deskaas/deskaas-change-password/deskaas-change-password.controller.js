import forEach from 'lodash/forEach';
import get from 'lodash/get';

export default class DeskaasChangePasswordCtrl {
  /* @ngInject */
  constructor($translate, OvhApiDeskaasService) {
    this.OvhApiDeskaasService = OvhApiDeskaasService;
    this.$translate = $translate;
    this.policies = {};

    this.values = {
      password: '',
      generatePwd: false,
    };

    this.flags = {
      init: false,
    };
  }

  ok() {
    if (!this.values.generatePwd && !this.values.password) {
      this.cancel();
      return;
    }
    return this.resetPassword(this.values);
  }

  resetPassword(passwordParams) {
    this.flags.init = true;
    let promise;
    if (passwordParams.generatePwd) {
      promise = this.OvhApiDeskaasService.v6()
        .resetPassword({ serviceName: this.serviceName }, null).$promise;
    } else if (passwordParams.password) {
      promise = this.OvhApiDeskaasService.v6()
        .resetPassword({
          serviceName: this.serviceName,
        }, {
          password: passwordParams.password,
        }).$promise;
    } else {
      return this.$q.when();
    }

    return promise.then(result => this.goBackToDetails(
      this.$translate.instant('vdi_resetting_password', {
        serviceName: this.serviceName,
      }),
      'success',
      {
        task: result.taskId,
      },
    ))
      .catch((error) => {
        this.goBackToDetails(
          this.$translate.instant('vdi_task_error', {
            id: this.serviceName,
            message: get(error, 'data.message'),
          }),
          'error',
        );
      })
      .finally(() => {
        this.flags.init = false;
      });
  }

  createExpression(policies) {
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

  cancel() {
    this.goBackToDetails();
  }

  $onInit() {
    this.flags.init = true;

    this.OvhApiDeskaasService.v6().getPwdPolicy({ serviceName: this.serviceName }, null).$promise
      .then((policies) => {
        this.policies = policies;

        this.policies.deniedCharsString = policies.deniedChars.join(', ');
        this.policies.pattern = this.createExpression(policies);
      })
      .finally(() => {
        this.flags.init = false;
      });
  }
}
