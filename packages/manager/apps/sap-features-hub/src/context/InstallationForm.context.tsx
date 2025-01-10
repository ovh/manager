import React, {
  useState,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
} from 'react';
import { InstallationForm } from '@/types/form.type';
import { installationInitialValues } from './installationInitialValues.constants';

type FormContextType = {
  values: InstallationForm;
  setValues: Dispatch<SetStateAction<InstallationForm>>;
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
  const contextValue = useMemo(() => ({ values, setValues }), [values]);

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
