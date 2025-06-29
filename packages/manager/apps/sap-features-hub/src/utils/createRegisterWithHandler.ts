import { FieldValues, UseFormRegister } from 'react-hook-form';

/**
 * Function to be used with react-hook-form to easily add global handler for multiple fields.
 * For custom handlers on a specific field,
 * you should prioritize adding that handler directly on the field.
 *
 * @param useFormRegister - The register function from `useForm` in react-hook-form.
 * @returns A new register function that includes the global handler.
 */
export const createRegisterWithHandler = <TFieldValues extends FieldValues>(
  baseRegister: UseFormRegister<TFieldValues>,
  customHandler: (event: Event) => void,
): UseFormRegister<TFieldValues> => (...params) => {
  const { onChange, ...baseOptions } = baseRegister(...params);
  return {
    ...baseOptions,
    onChange: (event: Event) => {
      customHandler(event);
      return onChange(event);
    },
  };
};
