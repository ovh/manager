import { useParams } from 'react-router-dom';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import { getProject } from '@/data/project/project.api';

const usePciProject = () => {
  const { projectId } = useParams();

  return useQueryImmediateRefetch({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
