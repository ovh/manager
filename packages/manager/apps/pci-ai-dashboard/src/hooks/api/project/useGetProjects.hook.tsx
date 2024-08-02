import { useParams } from 'react-router-dom';
import { getProject } from '@/data/api/project/project.api';
import { useQueryImmediateRefetch } from '../useImmediateRefetch.hook';

const usePciProject = () => {
  const { projectId } = useParams();

  return useQueryImmediateRefetch({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });
};

export default usePciProject;
