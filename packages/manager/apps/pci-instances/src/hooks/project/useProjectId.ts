import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { validate } from 'uuid';
import { formatUUID } from '@/utils';

export type TProjectId = string | null;

export const useProjectId = (): TProjectId => {
  const { projectId } = useParams();
  const isValidUUID = useMemo(
    () => (projectId ? validate(formatUUID(projectId) || '') : false),
    [projectId],
  );

  if (!projectId || !isValidUUID) return null;

  return projectId;
};
