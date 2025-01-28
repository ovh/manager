import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getPresetImage } from '@/data/api/ai/job/capabilities/image.api';

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
