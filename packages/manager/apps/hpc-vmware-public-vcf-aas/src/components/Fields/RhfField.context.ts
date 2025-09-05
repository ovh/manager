import { createContext, useContext } from 'react';
import { FieldValues, UseControllerReturn } from 'react-hook-form';

export type RhfFieldContextParams<TFieldValues> = {
  id: string;
  helperMessage?: string;
  controller: UseControllerReturn<TFieldValues>;
};

export const RhfFieldContext = createContext<RhfFieldContextParams<
  FieldValues
> | null>(null);

export const useRhfFieldContext = () => {
  const context = useContext(RhfFieldContext);
  if (!context) {
    throw new Error(
      'RhfFieldContext must be used within a RhfFieldControllerProvider',
    );
  }
  return context;
};
