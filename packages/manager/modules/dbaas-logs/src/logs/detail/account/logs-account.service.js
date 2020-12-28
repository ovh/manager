export default class LogsAccountService {
  /* @ngInject */
  constructor(OvhApiDbaas, LogsHelperService, LogsConstants) {
    this.UserApiService = OvhApiDbaas.Logs()
      .User()
      .v6();
    this.LogsLexiService = OvhApiDbaas.Logs().v6();
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.initializePasswordRules();
  }

  getPasswordRules(reset) {
    if (reset) {
      this.initializePasswordRules();
    }
    return this.passwordRules;
  }

  initializePasswordRules() {
    this.passwordRules = [
      {
        message: 'logs_password_rule_length',
        isValid: false,
        isValidated: false,
        validator: (password) => password && password.length >= 12,
      },
      {
        message: 'logs_password_rule_contains_number',
        isValid: false,
        isValidated: false,
        validator: (password) => password && password.match('.*[0-9].*'),
      },
      {
        message: 'logs_password_rule_contains_uppercase',
        isValid: false,
        isValidated: false,
        validator: (password) => password && password.match('.*[A-Z].*'),
      },
      {
        message: 'logs_password_rule_contains_lowercase',
        isValid: false,
        isValidated: false,
        validator: (password) => password && password.match('(?=.*[a-z])'),
      },
      {
        message: 'logs_password_rule_contains_special',
        translateParams: {
          specialCharacters: this.LogsConstants.PASSWORD_SPECIAL_CHARACTERS,
        },
        isValid: false,
        isValidated: false,
        validator: (password) =>
          password &&
          password.match(
            `.*[${this.constructor.escapeRegExp(
              this.LogsConstants.PASSWORD_SPECIAL_CHARACTERS,
            )}].*`,
          ),
      },
    ];
  }

  changePassword(serviceName, newPassword, isSetup) {
    return this.UserApiService.changePassword(
      { serviceName },
      { password: newPassword },
    )
      .$promise.then((operation) => {
        if (isSetup) {
          this.resetAllCache();
        }
        const message = isSetup
          ? 'logs_password_setup_success'
          : 'logs_password_change_success';
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          message,
          {},
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          isSetup ? 'logs_password_setup_error' : 'logs_password_change_error',
          err,
          {},
        ),
      );
  }

  static escapeRegExp(msg) {
    return msg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  resetAllCache() {
    this.LogsLexiService.resetAllCache();
  }
}
