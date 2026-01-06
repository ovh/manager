import { useParams, useSearchParams } from 'react-router-dom';

export const useProjectIdFromParams = (): string => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();

  if (projectId) {
    return projectId;
  }

  // Fallback: try to get projectId from search params
  const searchProjectId = searchParams.get('projectId');

  if (searchProjectId) {
    return searchProjectId;
  }

  throw new Error('Missing projectId');
};
