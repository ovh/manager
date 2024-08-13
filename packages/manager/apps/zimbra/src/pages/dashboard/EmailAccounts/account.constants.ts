interface FormInputRegexInterface {
  [key: string]: RegExp;
}

export const formInputRegex: FormInputRegexInterface = {
  alias: /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/,
  account: /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/,
  password: /^(?=(.*\d))(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-zA-Z])(?=(.*)).{9,}$/,
};
