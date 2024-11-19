import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import { postTracking } from '@/data/api/tracking/tracking.api';

interface UsePostTrackingProps {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function usePostTracking({ onError, onSuccess }: UsePostTrackingProps) {
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (trackingKey: string) => {
      return postTracking(projectId, trackingKey);
    },
    onError,
    onSuccess,
  });

  return {
    postTracking: (trackingKey: string) => {
      return mutation.mutate(trackingKey);
    },
    ...mutation,
  };
}
