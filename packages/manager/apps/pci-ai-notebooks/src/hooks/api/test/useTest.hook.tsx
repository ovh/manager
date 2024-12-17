import { useParams } from 'react-router-dom';
import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  TestType,
  deleteTest,
  getTest,
  postTest,
} from '@/data/api/test/test.api';
import { AIError } from '@/data/api';
import { useQueryImmediateRefetch } from '../useImmediateRefetch';

export function useGetTest(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'alerting'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getTest({ projectId }),
    ...options,
  }) as UseQueryResult<TestType[], Error>;
}

export interface PostMutateTestProps {
  onError: (cause: AIError) => void;
  onSuccess: (test?: TestType) => void;
}

export function usePostTest({ onError, onSuccess }: PostMutateTestProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (testInfo: TestType) => {
      return postTest({ projectId, test: testInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate notebook list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'alerting'],
      });
      onSuccess(data);
    },
  });

  return {
    postTest: (postInfo: TestType) => {
      return mutation.mutate(postInfo);
    },
    ...mutation,
  };
}

export function useDeleteTest({ onError, onSuccess }: PostMutateTestProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (testInfo: TestType) => {
      return deleteTest({ projectId, test: testInfo });
    },
    onError,
    onSuccess: () => {
      // invalidate notebook list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'alerting'],
      });
      onSuccess();
    },
  });

  return {
    deleteTest: (postInfo: TestType) => {
      return mutation.mutate(postInfo);
    },
    ...mutation,
  };
}
