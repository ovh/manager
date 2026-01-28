import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { ReplicationFormValues } from './useReplicationForm.hook';
import { useAvailableStorageClasses } from '@/hooks/useAvailableStorageClasses.hook';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';
import { useS3Data } from '../../../S3.context';
import storages from '@/types/Storages';

interface ReplicationFormContextProps {
  form: UseFormReturn<ReplicationFormValues>;
  isPending: boolean;
  isEditMode: boolean;
  replicationTitle: string;
  showScopeFields: boolean;
  showStorageClassField: boolean;
  isDeleteMarkerDisabled: boolean;
  isTagsDisabled: boolean;
  availableStorageClasses: storages.StorageClassEnum[];
  replicationWarningMessage: string | null;
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
  replicationTitle: string;
  children: React.ReactNode;
}

export const ReplicationFormProvider = ({
  form,
  isPending,
  isEditMode = false,
  replicationTitle,
  children,
}: ReplicationFormProviderProps) => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const regionsQuery = useGetRegions(projectId);
  const formValues = form.watch();

  const hasTags = formValues.tags?.some((tag) => tag.key.trim() !== '');
  const isDeleteMarkerEnabled =
    formValues.deleteMarkerReplication === 'enabled';

  const { availableStorageClasses } = useAvailableStorageClasses(
    formValues.destination.region,
  );

  const replicationWarningMessage = useMemo(() => {
    const regions = regionsQuery.data;
    if (!regions || !s3?.region || !formValues.destination.region) return null;

    const getType = (name: string) =>
      regions.find((r) => r.name === name)?.type;
    const srcType = getType(s3.region);
    const destType = getType(formValues.destination.region);
    const { region: AZ1, 'region-3-az': AZ3 } = RegionTypeEnum;

    if (srcType === AZ1 && destType === AZ3) return 'warning1AZTo3AZ';
    if (srcType === AZ3 && destType === AZ1) return 'warning3AZTo1AZ';
    return null;
  }, [regionsQuery.data, s3?.region, formValues.destination.region]);

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
    replicationTitle,
    showScopeFields: formValues.isReplicationApplicationLimited,
    showStorageClassField: formValues.useStorageClass,
    availableStorageClasses,
    isDeleteMarkerDisabled: hasTags,
    isTagsDisabled: isDeleteMarkerEnabled,
    replicationWarningMessage,
  };
  return (
    <ReplicationFormContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </ReplicationFormContext.Provider>
  );
};
