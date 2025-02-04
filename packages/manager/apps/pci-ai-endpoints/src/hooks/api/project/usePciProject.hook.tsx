import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '@/data/api/project/project.api';

const usePciProject = () => {
  const { projectId } = useParams();

  return useQuery({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
