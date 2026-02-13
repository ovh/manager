import React, { createContext, useContext } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import storages from '@/types/Storages';
import { LifecycleFormValues } from './useLifecycleForm.hook';

interface LifecycleFormContextProps {
  form: UseFormReturn<LifecycleFormValues>;
  isPending: boolean;
  isEditMode: boolean;
  lifecycleTitle: string;
  availableStorageClasses: storages.StorageClassEnum[];
}

const LifecycleFormContext = createContext<LifecycleFormContextProps | null>(
  null,
);

export const useLifecycleFormContext = () => {
  const context = useContext(LifecycleFormContext);
  if (!context) {
    throw new Error(
      'useLifecycleFormContext must be used within a LifecycleFormProvider',
    );
  }
  return context;
};

interface LifecycleFormProviderProps {
  form: UseFormReturn<LifecycleFormValues>;
  isPending: boolean;
  isEditMode?: boolean;
  lifecycleTitle: string;
  availableStorageClasses: storages.StorageClassEnum[];
  children: React.ReactNode;
}

export const LifecycleFormProvider = ({
  form,
  isPending,
  isEditMode = false,
  lifecycleTitle,
  availableStorageClasses,
  children,
}: LifecycleFormProviderProps) => {
  const contextValue: LifecycleFormContextProps = {
    form,
    isPending,
    isEditMode,
    lifecycleTitle,
    availableStorageClasses,
  };

  return (
    <LifecycleFormContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </LifecycleFormContext.Provider>
  );
};
