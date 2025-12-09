import React, { createContext, useContext, useEffect } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import { ReplicationFormValues } from './useReplicationForm.hook';
import { useAvailableStorageClasses } from '@/hooks/useAvailableStorageClasses.hook';
import storages from '@/types/Storages';

interface ReplicationFormContextProps {
  form: UseFormReturn<ReplicationFormValues>;
  isPending: boolean;
  isEditMode: boolean;
  showScopeFields: boolean;
  showStorageClassField: boolean;
  isDeleteMarkerDisabled: boolean;
  isTagsDisabled: boolean;
  availableStorageClasses: storages.StorageClassEnum[];
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

  const availableStorageClasses: storages.StorageClassEnum[] = useAvailableStorageClasses(
    formValues.destination.region,
  ).filter((st) => st !== storages.StorageClassEnum.DEEP_ARCHIVE);

  useEffect(() => {
    // if current class is no longer available, reset it
    if (!availableStorageClasses.includes(formValues.storageClass)) {
      form.setValue('storageClass', availableStorageClasses[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [availableStorageClasses, formValues.storageClass, form]);

  const contextValue: ReplicationFormContextProps = {
    form,
    isPending,
    isEditMode,
    showScopeFields: formValues.isReplicationApplicationLimited,
    showStorageClassField: formValues.useStorageClass,
    availableStorageClasses,
    isDeleteMarkerDisabled: hasTags,
    isTagsDisabled: isDeleteMarkerEnabled,
  };
  return (
    <ReplicationFormContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </ReplicationFormContext.Provider>
  );
};
