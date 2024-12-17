import { useState } from 'react';

export type FieldType = {
  value: string;
  touched?: boolean;
  defaultValue?: string;
  hasError?: boolean;
  required?: boolean;
  validate?: ((value: string) => boolean) | RegExp;
};

export interface FormTypeInterface {
  [key: string]: FieldType;
}

export const validateField = (
  name: string,
  value: string,
  form: FormTypeInterface,
) => {
  const field = form[name];

  if (!field) {
    throw new Error(`validateField field is not defined for name "${name}"`);
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

export const validateForm = (form: FormTypeInterface) => {
  const touched = Object.values(form).find((field) => field.touched);
  const error = Object.values(form).find(
    (field) => field.hasError || (field.required && field.value === ''),
  );
  return touched && !error;
};

type FormTypeOptions = {
  onValueChange?: (
    state: FormTypeInterface,
    name: string,
    value: string,
  ) => FormTypeInterface;
};

export const useForm = (
  initialForm: FormTypeInterface = {},
  options: FormTypeOptions = {},
) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [form, setForm] = useState<FormTypeInterface>(initialForm);

  const setValue = (name: string, value: string, isBlur = false) => {
    let newForm = form;
    if (value !== form[name].value || isBlur) {
      newForm[name] = {
        ...form[name],
        value,
        touched: true,
        hasError: !validateField(name, value, form),
      };
      if (typeof options?.onValueChange === 'function') {
        newForm = options.onValueChange(newForm, name, value);
      }
      setForm((oldForm) => ({ ...oldForm, ...newForm }));
      setIsFormValid(validateForm(form));
    }
  };
  return { isFormValid, form, setValue, setForm };
};
