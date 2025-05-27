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
    | 'deploymentType'
    | 'network'
    | 'thickDatastorePolicy'
    | 'applicationServerOva'
    | 'applicationServerDatastore'
    | 'hanaServerOva'
    | 'hanaServerDatastore'
  >;
};

type FormContextType = {
  values: InstallationFormValues;
  setValues: Dispatch<SetStateAction<InstallationFormValues>>;
  errors: InstallationFormErrors;
  setErrors: Dispatch<SetStateAction<InstallationFormErrors>>;
  initializationState: InitializationState;
  setInitializationState: Dispatch<SetStateAction<InitializationState>>;
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

  const contextValue = {
    values,
    setValues,
    errors,
    setErrors,
    initializationState,
    setInitializationState,
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
