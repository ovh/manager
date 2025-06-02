import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getPresetImage } from '@/data/api/ai/job/capabilities/image.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetImage(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'job', 'capabilities', 'presetImage'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getPresetImage({ projectId }),
    ...options,
  }) as UseQueryResult<ai.job.PresetImage[], Error>;
}
