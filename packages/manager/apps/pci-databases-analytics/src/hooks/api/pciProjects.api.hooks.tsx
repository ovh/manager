import { useParams } from 'react-router-dom';

import { getProject } from '@/api/projects';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

const usePciProject = () => {
  const { projectId } = useParams();

  return useQueryImmediateRefetch({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
