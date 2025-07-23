type Rule = (password: string) => boolean;

export const sapPasswordRules = {
  hasMinLength: (pwd: string) => pwd?.length >= 10,
  doesNotExceedMaxLength: (pwd: string) => pwd?.length <= 30,
  hasLowerCase: (pwd: string) => /[a-z]/.test(pwd),
  hasUpperCase: (pwd: string) => /[A-Z]/.test(pwd),
  hasDigit: (pwd: string) => /\d/.test(pwd),
  hasSpecialChar: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
  doesNotStartWithDigitOrUnderscore: (pwd: string) => !/^[0-9_]/.test(pwd),
  doesNotHaveTemplateSyntax: (pwd: string) => !/{%|%}/.test(pwd),
  doesNotHaveSapForbiddenChar: (pwd: string) => !/[\\'"`$]/.test(pwd),
  hasValidSapHanaSpecialChars: (pwd: string) => {
    const hasRequiredSpecialChars = /[_#@$!]/.test(pwd);
    const hasOnlyValidChars = /^[A-Za-z0-9_#@$!]*$/.test(pwd);
    return hasRequiredSpecialChars && hasOnlyValidChars;
  },
};

const baseRules: Rule[] = [
  sapPasswordRules.hasMinLength,
  sapPasswordRules.doesNotExceedMaxLength,
  sapPasswordRules.hasLowerCase,
  sapPasswordRules.hasUpperCase,
  sapPasswordRules.hasDigit,
];
const sapRules: Rule[] = [
  ...baseRules,
  sapPasswordRules.hasSpecialChar,
  sapPasswordRules.doesNotHaveTemplateSyntax,
  sapPasswordRules.doesNotHaveSapForbiddenChar,
];
const sapHanaRules: Rule[] = [
  ...baseRules,
  sapPasswordRules.hasValidSapHanaSpecialChars,
  sapPasswordRules.doesNotStartWithDigitOrUnderscore,
];

const validatePassword = (password: string, rules: Rule[]): boolean =>
  rules.every((rule) => rule(password));

export const isValidSapPassword = (password: string): boolean =>
  validatePassword(password, sapRules);

export const isValidSapHanaPassword = (password: string): boolean =>
  validatePassword(password, sapHanaRules);
