import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getProjectCredit } from '../../api/services';

export const useProjectCredit = () => {
  const { projectId } = useParams();
  return useQuery({
    queryKey: ['project', projectId, 'credit'],
    queryFn: () => getProjectCredit(projectId!),
    enabled: !!projectId,
  });
};
