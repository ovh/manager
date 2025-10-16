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

type InitializationState = {
  isPrefilled: boolean;
  prefilledData: Pick<
    InstallationFormValues,
    | 'serviceName'
    | 'datacenterId'
    | 'clusterName'
    | 'applicationType'
    | 'applicationVersion'
    | 'deploymentType'
    | 'network'
    | 'thickDatastorePolicy'
    | 'applicationServerOva'
    | 'applicationServerDatastore'
    | 'hanaServerOva'
    | 'hanaServerDatastore'
  >;
};

export type FormContextType = {
  // State
  values: InstallationFormValues;
  errors: InstallationFormErrors;
  initializationState: InitializationState;

  // React Setters
  setValues: Dispatch<SetStateAction<InstallationFormValues>>;
  setErrors: Dispatch<SetStateAction<InstallationFormErrors>>;
  setInitializationState: Dispatch<SetStateAction<InitializationState>>;

  // Handlers
  clearInstallationForm: () => void;
};

type FormContextProviderProps = {
  children: ReactNode;
};

const InstallationFormContext = createContext<FormContextType | undefined>(
  undefined,
);

const defaultInitializationState: InitializationState = {
  isPrefilled: false,
  prefilledData: {
    serviceName: '',
    datacenterId: null,
    clusterName: '',
    applicationType: null,
    applicationVersion: null,
    deploymentType: null,
    network: '',
    thickDatastorePolicy: '',
    hanaServerOva: '',
    hanaServerDatastore: '',
    applicationServerOva: '',
    applicationServerDatastore: '',
  },
};

export const InstallationFormContextProvider: React.FC<FormContextProviderProps> = ({
  children,
}) => {
  const [values, setValues] = useState(installationInitialValues);
  const [errors, setErrors] = useState(installationInitialErrors);
  const [initializationState, setInitializationState] = useState(
    defaultInitializationState,
  );

  const clearInstallationForm = () => {
    setValues(installationInitialValues);
    setErrors(installationInitialErrors);
    setInitializationState(defaultInitializationState);
  };

  const contextValue: FormContextType = {
    values,
    setValues,
    errors,
    setErrors,
    initializationState,
    setInitializationState,
    clearInstallationForm,
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
