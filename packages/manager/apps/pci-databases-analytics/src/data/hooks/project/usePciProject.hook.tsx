import { useParams } from 'react-router-dom';
import { useQueryImmediateRefetch } from '@/data/hooks/useImmediateRefetch.hook';
import { getProject } from '@/data/api/project/project.api';

const usePciProject = () => {
  const { projectId } = useParams();

  return useQueryImmediateRefetch({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
