import { UseFormReturn } from 'react-hook-form';
import { ReplicationFormValues } from '../schemas/replicationForm.schema';

export const useReplicationFormState = (
  form: UseFormReturn<ReplicationFormValues>,
) => {
  const formValues = form.watch();

  const hasTags =
    formValues.tags &&
    Object.values(formValues.tags).some(
      (tag) => tag.key.trim() !== '' || tag.value.trim() !== '',
    );
  const isDeleteMarkerEnabled =
    formValues.deleteMarkerReplication === 'enabled';

  return {
    showScopeFields: formValues.isReplicationApplicationLimited,
    showStorageClassField: formValues.useStorageClass,
    isDeleteMarkerDisabled: hasTags,
    isTagsDisabled: isDeleteMarkerEnabled,
  };
};
