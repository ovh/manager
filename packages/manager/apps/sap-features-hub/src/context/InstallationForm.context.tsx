import React, {
  useState,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from 'react';
import {
  InstallationFormErrors,
  InstallationFormValues,
} from '@/types/form.type';
import {
  installationInitialErrors,
  installationInitialValues,
} from './installationInitialValues.constants';
import { DeploymentType } from '@/types/sapCapabilities.type';

type InitializationState = {
  isPrefilled: boolean;
  prefilledDeploymentType: DeploymentType | null;
  hasChangedPrefilledDeploymentType: boolean;
};

type FormContextType = {
  values: InstallationFormValues;
  setValues: Dispatch<SetStateAction<InstallationFormValues>>;
  errors: InstallationFormErrors;
  setErrors: Dispatch<SetStateAction<InstallationFormErrors>>;
  initializationState: InitializationState;
  setInitializationState: Dispatch<SetStateAction<InitializationState>>;
  clearInitializationState: () => void;
  setHasChangedPrefilledDeploymentType: (hasChanged: boolean) => void;
};

type FormContextProviderProps = {
  children: ReactNode;
};

const InstallationFormContext = createContext<FormContextType | undefined>(
  undefined,
);

const initialSetupState: InitializationState = {
  isPrefilled: false,
  prefilledDeploymentType: null,
  hasChangedPrefilledDeploymentType: false,
};

export const InstallationFormContextProvider: React.FC<FormContextProviderProps> = ({
  children,
}) => {
  const [values, setValues] = useState(installationInitialValues);
  const [errors, setErrors] = useState(installationInitialErrors);
  const [initializationState, setInitializationState] = useState(
    initialSetupState,
  );

  const clearInitializationState = () =>
    setInitializationState(initialSetupState);

  const setHasChangedPrefilledDeploymentType = (hasChanged: boolean) =>
    setInitializationState((prev) => ({
      ...prev,
      hasChangedDeploymentType: hasChanged,
    }));

  const contextValue = {
    values,
    setValues,
    errors,
    setErrors,
    initializationState,
    setInitializationState,
    clearInitializationState,
    setHasChangedPrefilledDeploymentType,
  };

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
