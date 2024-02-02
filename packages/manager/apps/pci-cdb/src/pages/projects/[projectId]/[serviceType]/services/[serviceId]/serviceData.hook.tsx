import { useOutletContext } from 'react-router-dom';
import { ServiceLayoutContext } from './_layout';
import { useRequiredParams } from '@/hooks/useRequiredParams';

export function useServiceData() {
  const { projectId } = useRequiredParams<{
    projectId: string;
  }>();
  const { service, serviceQuery } = useOutletContext() as ServiceLayoutContext;
  return { projectId, service, serviceQuery };
}
