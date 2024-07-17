import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getProject } from '../api/apiv2/services';

// TODO: remove this file

const usePciProject = () => {
  const { projectId } = useParams();

  return useQuery({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
