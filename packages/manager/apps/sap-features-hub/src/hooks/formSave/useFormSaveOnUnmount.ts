import { Dispatch, SetStateAction, useEffect } from 'react';
import { FieldValues, UseFormGetValues } from 'react-hook-form';

type TUseFormSaveOnUnmount<TFormData extends FieldValues> = {
  getValues: UseFormGetValues<TFormData>;
  setValues: Dispatch<SetStateAction<TFormData>>;
};

export const useFormSaveOnUnmount = <TFormData extends FieldValues>({
  setValues,
  getValues,
}: TUseFormSaveOnUnmount<TFormData>) => {
  const saveForm = () => setValues((prev) => ({ ...prev, ...getValues() }));

  useEffect(() => {
    return saveForm;
  }, []);
};
