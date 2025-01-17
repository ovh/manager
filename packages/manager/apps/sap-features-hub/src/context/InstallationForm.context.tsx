import React, {
  useState,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
} from 'react';
import {
  InstallationFormErrors,
  InstallationFormValues,
} from '@/types/form.type';
import {
  installationInitialErrors,
  installationInitialValues,
} from './installationInitialValues.constants';

type FormContextType = {
  values: InstallationFormValues;
  setValues: Dispatch<SetStateAction<InstallationFormValues>>;
  errors: InstallationFormErrors;
  setErrors: Dispatch<SetStateAction<InstallationFormErrors>>;
};
type FormContextProviderProps = {
  children: ReactNode;
};

const InstallationFormContext = createContext<FormContextType | undefined>(
  undefined,
);

export const InstallationFormContextProvider: React.FC<FormContextProviderProps> = ({
  children,
}) => {
  const [values, setValues] = useState(installationInitialValues);
  const [errors, setErrors] = useState(installationInitialErrors);
  const contextValue = useMemo(
    () => ({ values, setValues, errors, setErrors }),
    [values, errors],
  );

  return (
    <InstallationFormContext.Provider value={contextValue}>
      {children}
    </InstallationFormContext.Provider>
  );
};

export const useInstallationFormContext = (): FormContextType => {
  const context = useContext(InstallationFormContext);
  if (context === undefined) {
    throw new Error(
      'useInstallationFormContext must be used within a InstallationFormProvider',
    );
  }
  return context;
};
