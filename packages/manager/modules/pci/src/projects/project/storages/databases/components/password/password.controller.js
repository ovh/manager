import { PASSWORD_LENGTH, PASSWORD_PATTERNS } from './password.constants';

export default class {
  constructor() {
    this.PASSWORD_LENGTH = PASSWORD_LENGTH;
    this.PASSWORD_PATTERNS = PASSWORD_PATTERNS;
  }

  checkPasswordLength(password) {
    return (
      password &&
      password.length >= this.PASSWORD_LENGTH.MIN &&
      password.length <= this.PASSWORD_LENGTH.MAX
    );
  }
}
