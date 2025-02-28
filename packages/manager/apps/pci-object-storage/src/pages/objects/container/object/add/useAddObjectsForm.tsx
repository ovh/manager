import { useState } from 'react';
import { OBJECT_CONTAINER_STORAGE_CLASS } from '@/constants';

type TFormState = {
  prefix: string;
  storageClass: string;
  files: File[];
};

export const useAddObjectForm = () => {
  const [formState, setFormState] = useState<TFormState>({
    prefix: '/',
    storageClass: OBJECT_CONTAINER_STORAGE_CLASS.STANDARD,
    files: [],
  });

  const updatePrefix = (prefix: string) => {
    setFormState((prev) => ({ ...prev, prefix }));
  };

  const updateStorageClass = (storageClass: string) => {
    setFormState((prev) => ({ ...prev, storageClass }));
  };

  const updateFiles = (files: File[]) => {
    setFormState((prev) => ({ ...prev, files }));
  };

  const isFormValid = Boolean(formState.prefix);

  return {
    formState,
    updatePrefix,
    updateStorageClass,
    updateFiles,
    isFormValid,
  };
};
