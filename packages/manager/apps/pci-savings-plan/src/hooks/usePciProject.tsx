import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getProject } from '@/data/api/apiv2/services';

const usePciProject = () => {
  const { projectId } = useParams();

  return useQuery({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
