import { useParams } from 'react-router-dom';

export type TProjectId = string;

export const useProjectId = (): TProjectId => {
  const { projectId } = useParams();

  if (!projectId) throw new Error('Missing projectId');

  return projectId;
};
