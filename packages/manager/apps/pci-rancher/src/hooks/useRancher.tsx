import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getByRancherIdProjectId, getRancherProjectById } from '@/api';
import { ErrorResponse, RancherService } from '@/api/api.type';

export const useRancher = () => {
  const { projectId, rancherId } = useParams();
  return useQuery<{ data: RancherService }, ErrorResponse>({
    queryKey: ['project', projectId, 'rancher', rancherId],
    queryFn: () => getByRancherIdProjectId(projectId, rancherId),
  });
};

export const useRanchers = () => {
  const { projectId } = useParams();
  return useQuery<{ data: RancherService[] }, ErrorResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getRancherProjectById(projectId),
    refetchInterval: 5000,
  });
};
