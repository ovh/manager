import get from 'lodash/get';
import zxcvbn from 'zxcvbn';

import {
  ENTERPRISE_CLOUD_DATABASE_MIN_PASSWORD_STRENGTH,
  ENTERPRISE_CLOUD_DATABASE_PASSWORD_LENGTH,
  ENTERPRISE_CLOUD_DATABASE_PASSWORD_PATTERNS,
} from './password.constants';

export default class EnterpriseCloudDatabasePasswordCtrl {
  /* @ngInject */
  constructor() {
    this.PASSWORD_LENGTH = ENTERPRISE_CLOUD_DATABASE_PASSWORD_LENGTH;
    this.PATTERNS = ENTERPRISE_CLOUD_DATABASE_PASSWORD_PATTERNS;
  }

  $onInit() {
    this.password = '';
    this.passwordScore = 0;
  }

  checkPasswordLength(password) {
    return password
      && (password.length >= this.PASSWORD_LENGTH.MIN)
      && (password.length <= this.PASSWORD_LENGTH.MAX);
  }

  checkPasswordStrength() {
    return this.passwordScore >= ENTERPRISE_CLOUD_DATABASE_MIN_PASSWORD_STRENGTH;
  }

  passwordChanged(password) {
    this.passwordScore = password ? get(zxcvbn(password), 'score') : 0;
    this.password = password || '';
    this.onChange({ data: password });
  }
}
