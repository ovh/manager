import React, { createContext, useContext } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import { ReplicationFormValues } from './useReplicationForm.hook';

interface ReplicationFormContextProps {
  form: UseFormReturn<ReplicationFormValues>;
  isPending: boolean;
  isEditMode: boolean;
  showScopeFields: boolean;
  showStorageClassField: boolean;
  isDeleteMarkerDisabled: boolean;
  isTagsDisabled: boolean;
}

const ReplicationFormContext = createContext<ReplicationFormContextProps | null>(
  null,
);

export const useReplicationFormContext = () => {
  const context = useContext(ReplicationFormContext);
  if (!context) {
    throw new Error(
      'useReplicationFormContext must be used within a ReplicationFormProvider',
    );
  }
  return context;
};

interface ReplicationFormProviderProps {
  form: UseFormReturn<ReplicationFormValues>;
  isPending: boolean;
  isEditMode?: boolean;
  children: React.ReactNode;
}

export const ReplicationFormProvider = ({
  form,
  isPending,
  isEditMode = false,
  children,
}: ReplicationFormProviderProps) => {
  const formValues = form.watch();

  const hasTags =
    formValues.tags &&
    Object.values(formValues.tags).some(
      (tag) => tag.key.trim() !== '' || tag.value.trim() !== '',
    );
  const isDeleteMarkerEnabled =
    formValues.deleteMarkerReplication === 'enabled';

  const contextValue: ReplicationFormContextProps = {
    form,
    isPending,
    isEditMode,
    showScopeFields: formValues.isReplicationApplicationLimited,
    showStorageClassField: formValues.useStorageClass,
    isDeleteMarkerDisabled: hasTags,
    isTagsDisabled: isDeleteMarkerEnabled,
  };
  return (
    <ReplicationFormContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </ReplicationFormContext.Provider>
  );
};
