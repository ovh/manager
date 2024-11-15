export type FieldType = {
  value: string;
  touched: boolean;
  defaultValue?: string;
  hasError?: boolean;
  required?: boolean;
  validate?: ((value: string) => boolean) | RegExp;
};

export interface FormTypeInterface {
  [key: string]: FieldType;
}

export interface FormInputRegexInterface {
  [key: string]: RegExp;
}

export const checkValidityField = (
  name: string,
  value: string,
  form: FormTypeInterface,
) => {
  const field = form[name];

  if (!field) {
    throw new Error(
      `checkValidityField field is not defined for name "${name}"`,
    );
  }

  if (!field.required && !value) {
    return true;
  }

  if (typeof field.validate === 'function') {
    return field.validate(value);
  }

  if (field.validate instanceof RegExp) {
    return field.validate.test(String(value));
  }

  return !field.required || !!value;
};

export const checkValidityForm = (form: FormTypeInterface) => {
  const touched = Object.values(form).find((field) => field.touched);
  const error = Object.values(form).find(
    (field) => field.hasError || (field.required && field.value === ''),
  );
  return touched && !error;
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const ACCOUNT_REGEX = /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/;

export const PASSWORD_REGEX = /^(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*\d)(?=.*[A-Z])(?=(.*)).{10,64}$/;

export const OWNER_REGEX = /^[A-Za-z0-9]{2,20}$/;
