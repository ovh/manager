import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import {
  ScalingStrategyProps,
  scalingStrategy,
} from '@/data/api/ai/app/scaling-strategy/scaling-strategy.api';

export interface MutateLabelProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useScalingStrategy({ onError, onSuccess }: MutateLabelProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (scalingStratInfo: ScalingStrategyProps) => {
      return scalingStrategy(scalingStratInfo);
    },
    onError,
    onSuccess: () => {
      // invalidate applist to avoid displaying
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'app'],
      });
      onSuccess();
    },
  });

  return {
    scalingStrategy: (scalingStratInfo: ScalingStrategyProps) => {
      return mutation.mutate(scalingStratInfo);
    },
    ...mutation,
  };
}
