type Rule = (password: string) => boolean;

export const sapPasswordRules = {
  hasMinLength: (pwd: string) => pwd?.length >= 10,
  hasLowerCase: (pwd: string) => /[a-z]/.test(pwd),
  hasUpperCase: (pwd: string) => /[A-Z]/.test(pwd),
  hasDigit: (pwd: string) => /\d/.test(pwd),
  hasSpecialChar: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
  doesNotStartWithDigitOrUnderscore: (pwd: string) => !/^[0-9_]/.test(pwd),
  doesNotHaveTemplateSyntax: (pwd: string) => !/{%|%}/.test(pwd),
  doesNotHaveSapForbiddenChar: (pwd: string) => !/[\\'"`$]/.test(pwd),
  hasRequiredSapHanaSpecialChar: (pwd: string) => /[_#@$!]/.test(pwd),
};

const baseRules: Rule[] = [
  sapPasswordRules.hasMinLength,
  sapPasswordRules.hasLowerCase,
  sapPasswordRules.hasUpperCase,
  sapPasswordRules.hasDigit,
  sapPasswordRules.doesNotHaveTemplateSyntax,
];
const sapRules: Rule[] = [
  ...baseRules,
  sapPasswordRules.hasSpecialChar,
  sapPasswordRules.doesNotHaveSapForbiddenChar,
];
const sapHanaRules: Rule[] = [
  ...baseRules,
  sapPasswordRules.hasRequiredSapHanaSpecialChar,
  sapPasswordRules.doesNotStartWithDigitOrUnderscore,
];

const validatePassword = (password: string, rules: Rule[]): boolean =>
  rules.every((rule) => rule(password));

export const isValidSapPassword = (password: string): boolean =>
  validatePassword(password, sapRules);

export const isValidSapHanaPassword = (password: string): boolean =>
  validatePassword(password, sapHanaRules);
