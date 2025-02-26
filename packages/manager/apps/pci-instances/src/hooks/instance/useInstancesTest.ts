import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useProjectId } from '../project/useProjectId';
import {
  TUseInstancesQueryParams,
  useInstances,
} from '@/data/hooks/instance/useInstances';

export const useInstancesTest = ({
  limit,
  sort,
  sortOrder,
  filters,
}: TUseInstancesQueryParams) => {
  const projectUrl = useProjectUrl('public-cloud');
  const projectId = useProjectId();

  if (!projectId) {
    throw new Error('invalid projectID');
  }

  return useInstances(projectId, projectUrl, {
    limit,
    sort,
    sortOrder,
    filters,
  });
};
