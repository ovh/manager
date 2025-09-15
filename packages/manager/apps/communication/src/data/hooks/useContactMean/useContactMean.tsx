import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  createContactMean,
  deleteContactMean,
  getContactMean,
  restartValidationContactMean,
  updateContactMean,
  validateContactMean,
  getContactMeanListQueryKey,
  getContactMeanQueryKey,
} from '@/data/api/contacts';
import {
  ContactMean,
  ValidateContactMean,
} from '@/data/types/contact-mean.type';

export type UseContactMeanParams = {
  contactMeanId?: string;
  enabled?: boolean;
};
export const useContactMean = ({
  contactMeanId,
  enabled = true,
}: UseContactMeanParams): UseQueryResult<ContactMean, ApiError> =>
  useQuery({
    queryKey: getContactMeanQueryKey(contactMeanId as string),
    queryFn: () => getContactMean(contactMeanId as string),
    enabled: Boolean(contactMeanId && enabled),
  });

type UseCreateContactMeanParams = {
  onSuccess?: (contactMean: ContactMean) => void;
  onError?: (error: Error) => void;
};
export const useCreateContactMean = ({
  onSuccess,
  onError,
}: UseCreateContactMeanParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContactMean,
    onSuccess: async (contactMean: ContactMean) => {
      await queryClient.invalidateQueries({
        queryKey: getContactMeanListQueryKey(),
      });
      onSuccess?.(contactMean);
    },
    onError,
  });
};

type UpdateContactMeanParams = {
  contactMeanId: string;
  onSuccess?: (contactMean: ContactMean) => void;
  onError?: (error: Error) => void;
};
export const useRenameContactMean = ({
  contactMeanId,
  onSuccess,
  onError,
}: UpdateContactMeanParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (description: string | null) => {
      const contactMean = await queryClient.fetchQuery<ContactMean>({
        queryKey: getContactMeanQueryKey(contactMeanId),
        queryFn: async () => getContactMean(contactMeanId),
      });
      return updateContactMean({
        contactMeanId,
        data: { description, status: contactMean.status },
      });
    },
    onSuccess: async (contactMean: ContactMean) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContactMeanListQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getContactMeanQueryKey(contactMean.id),
        }),
      ]);
      onSuccess?.(contactMean);
    },
    onError,
  });
};

export const useChangeContactMeanStatus = ({
  contactMeanId,
  onSuccess,
  onError,
}: UpdateContactMeanParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'DISABLED' | 'VALID') => {
      const contactMean = await queryClient.fetchQuery<ContactMean>({
        queryKey: getContactMeanQueryKey(contactMeanId),
        queryFn: async () => getContactMean(contactMeanId),
      });
      return updateContactMean({
        contactMeanId,
        data: { description: contactMean.description, status },
      });
    },
    onSuccess: async (contactMean: ContactMean) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContactMeanListQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getContactMeanQueryKey(contactMean.id),
        }),
      ]);
      onSuccess?.(contactMean);
    },
    onError,
  });
};

type UseValidateContactMeanParams = {
  contactMeanId: string;
  onSuccess?: (contactMean: ContactMean) => void;
  onError?: (error: Error) => void;
};
export const useValidateContactMean = ({
  contactMeanId,
  onSuccess,
  onError,
}: UseValidateContactMeanParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ otp }: ValidateContactMean) =>
      validateContactMean(contactMeanId, { otp }),
    onSuccess: async (contactMean: ContactMean) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContactMeanListQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getContactMeanQueryKey(contactMean.id),
        }),
      ]);
      onSuccess?.(contactMean);
    },
    onError,
  });
};

type UseRestartValidationContactMeanParams = {
  contactMeanId: string;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};
export const useRestartValidationContactMean = ({
  contactMeanId,
  onSuccess,
  onError,
}: UseRestartValidationContactMeanParams) =>
  useMutation({
    mutationFn: () => restartValidationContactMean(contactMeanId),
    onSuccess,
    onError,
  });

type UseDeleteContactMeanParams = {
  id: string;
  onSuccess?: (contactMean: ContactMean) => void;
  onError?: (error: Error) => void;
};
export const useDeleteContactMean = ({
  id,
  onSuccess,
  onError,
}: UseDeleteContactMeanParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => deleteContactMean(id),
    onSuccess: async (contactMean: ContactMean) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContactMeanListQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getContactMeanQueryKey(contactMean.id),
        }),
      ]);
      onSuccess?.(contactMean);
    },
    onError,
  });
};
