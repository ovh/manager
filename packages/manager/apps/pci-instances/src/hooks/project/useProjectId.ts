import { useMemo } from 'react';
import { validate } from 'uuid';
import { useProject } from '@ovh-ux/manager-pci-common';
import { formatUUID } from '@/utils';

export type TProjectId = string;

export const useProjectId = (): TProjectId => {
  const { data } = useProject();

  const isValidUUID = useMemo(
    () =>
      data?.project_id ? validate(formatUUID(data.project_id) || '') : false,
    [data?.project_id],
  );

  if (!data?.project_id || !isValidUUID) {
    throw new Error('Invalid ProjectId');
  }

  return data.project_id;
};
