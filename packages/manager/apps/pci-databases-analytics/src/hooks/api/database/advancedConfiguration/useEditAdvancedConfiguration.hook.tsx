import { useMutation } from '@tanstack/react-query';
import {
  EditAdvancedConfiguration,
  editAdvancedConfiguration,
} from '@/data/api/database/advancedConfiguration.api';
import { CdbError } from '@/data/api/database';

interface UseEditAdvancedConfigurationProps {
  onError: (cause: CdbError) => void;
  onSuccess: (advancedConfiguration: Record<string, string>) => void;
}
export function useEditAdvancedConfiguration({
  onError,
  onSuccess,
}: UseEditAdvancedConfigurationProps) {
  const mutation = useMutation({
    mutationFn: (advancedConfiguration: EditAdvancedConfiguration) => {
      return editAdvancedConfiguration(advancedConfiguration);
    },
    onError,
    onSuccess,
  });

  return {
    updateAdvancedConfiguration: (
      advancedConfiguration: EditAdvancedConfiguration,
    ) => {
      return mutation.mutate(advancedConfiguration);
    },
    ...mutation,
  };
}
