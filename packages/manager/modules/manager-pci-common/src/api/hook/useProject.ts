import { useParams } from 'react-router-dom';
import {
  QueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getProject,
  getProjectQuota,
  TProject,
  TProjectUpdate,
  TQuota,
  updateProject,
} from '../data/project';

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export const getProjectQueryKey = (projectId: string) => ['project', projectId];

export const getProjectQuery = (projectId: string) => ({
  queryKey: getProjectQueryKey(projectId),
  queryFn: () => getProject(projectId),
});

export const useProject = (
  projectId?: string,
  options?: QueryOptions<TProject, ResponseAPIError>,
) => {
  const { projectId: defaultProjectId } = useParams();

  return useQuery({
    ...getProjectQuery(projectId || defaultProjectId),
    ...options,
  });
};

export interface UpdateProjectProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useUpdateProject = ({
  projectId,
  onError,
  onSuccess,
}: UpdateProjectProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (changes: TProjectUpdate) => updateProject(projectId, changes),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    update: (changes: TProjectUpdate) => mutation.mutate(changes),
    ...mutation,
  };
};

export const getProjectQuotaQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'quota'],
  queryFn: () => getProjectQuota(projectId),
});

export const useProjectQuota = (
  projectId?: string,
  filter?: {
    region: string;
  },
  options?: QueryOptions<TQuota[], ResponseAPIError>,
) => {
  const { projectId: defaultProjectId } = useParams();

  return useQuery({
    ...getProjectQuotaQuery(projectId || defaultProjectId),
    select: (data) =>
      filter ? data.filter((quota) => quota.region === filter.region) : data,
    ...options,
  });
};
