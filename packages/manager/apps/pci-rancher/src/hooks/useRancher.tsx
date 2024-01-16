import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getByRancherIdProjectId, getRancherProjectById } from '@/api';

export const useRancher = () => {
  const { projectId, rancherId } = useParams();
  return useQuery({
    queryKey: ['project', projectId, 'rancher', rancherId],
    queryFn: () => getByRancherIdProjectId(projectId, rancherId),
  });
};

export const useRanchers = () => {
  const { projectId } = useParams();
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getRancherProjectById(projectId),
    refetchInterval: 5000,
  });
};
