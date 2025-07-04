import { useParams } from 'react-router-dom';

export const useProjectId = (): string => {
  const { projectId } = useParams();

  if (!projectId) {
    throw new Error('Missing ProjectId');
  }

  return projectId;
};
