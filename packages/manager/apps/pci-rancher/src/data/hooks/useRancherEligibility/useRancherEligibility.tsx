import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getRancherEligibility } from '../../api/services';

const useRancherEligibility = () => {
  const { projectId } = useParams();
  return useQuery({
    queryKey: ['rancher-eligibility', projectId],
    queryFn: () => getRancherEligibility(projectId!),
    enabled: !!projectId,
  });
};

export default useRancherEligibility;
