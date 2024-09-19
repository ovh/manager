export type FieldType = {
  value: string;
  touched: boolean;
  hasError?: boolean;
  required?: boolean;
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
  formInputRegex: FormInputRegexInterface,
  form: FormTypeInterface,
) => {
  return formInputRegex[name]
    ? formInputRegex[name].test(value) ||
        (!form[name].required && form[name].value === '')
    : true;
};

export const checkValidityForm = (form: FormTypeInterface) => {
  const touched = Object.values(form).find((field) => field.touched);
  const error = Object.values(form).find(
    (field) => field.hasError || (field.required && field.value === ''),
  );
  return touched && !error;
};
